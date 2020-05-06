from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, viewsets, status, permissions
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework_jwt.serializers import VerifyJSONWebTokenSerializer
from rest_framework_jwt.settings import api_settings

from .models import Task, Project
from .serializers import ProjectSerializer, TaskSerializer, UserSerializer, UserSerializerWithToken


class IsOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


# Create your views here.
@api_view(['GET'])
@permission_classes(())  # IsOwner
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """
    print(request)
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserList(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        print(request.data)
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectView(viewsets.ModelViewSet):
    """ CRUD PROJECTS  """
    queryset = Project.objects
    serializer_class = ProjectSerializer
    permission_classes = (IsOwner,)
    authentication_classes = (JSONWebTokenAuthentication,)

    # Ensure a user sees only own Note objects.
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Project.objects.filter(owner=user)
        raise PermissionDenied()
    #
    # # Set user as owner of a Notes object.
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TaskView(viewsets.ModelViewSet):
    """ CRUD TASKS  """
    queryset = Task.objects
    serializer_class = TaskSerializer
    permission_classes = (IsOwner,)
    authentication_classes = (JSONWebTokenAuthentication,)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        project_id = request.data['project_id']
        if serializer.is_valid():
            project = get_object_or_404(Project, id=project_id)
            new_priority = 1
            if Task.objects.filter(board=project).last():
                new_priority = Task.objects.filter(board=project).last().priority + 1
            print('new_priority: ' + str(new_priority))
            serializer.validated_data["priority"] = new_priority
            task_response = Task.objects.create(
                owner = self.request.user,
                text=serializer.validated_data['text'],
                board=project,
                is_done=serializer.validated_data['is_done'],
                priority=new_priority,
                expiry_date=serializer.validated_data['expiry_date'],
            )
            # serializer.validated_data
            return Response(
                TaskSerializer(task_response).data, status=status.HTTP_201_CREATED
            )

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Ensure a user sees only own Note objects.
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Task.objects.filter(owner=user)
        raise PermissionDenied()

    # Set user as owner of a Notes object.
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
