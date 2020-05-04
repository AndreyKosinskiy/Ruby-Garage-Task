from django.shortcuts import render
from rest_framework import generics, viewsets, status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from .models import Task, Project
from .serializers import ProjectSerializer, TaskSerializer


# Create your views here.


class ProjectView(viewsets.ModelViewSet):
    """ CRUD PROJECTS  """
    queryset = Project.objects
    serializer_class = ProjectSerializer


class TaskView(viewsets.ModelViewSet):
    """ CRUD TASKS  """
    queryset = Task.objects
    serializer_class = TaskSerializer


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
