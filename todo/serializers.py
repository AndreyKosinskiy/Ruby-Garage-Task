from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User
from .models import Project, Task


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username',)


class UserSerializerWithToken(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validate_data):
        password = validate_data.pop('password', None)
        instance = self.Meta.model(**validate_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('token', 'id','username', 'password')


class TaskSerializer(serializers.ModelSerializer):
    """ TASKS """

    class Meta:
        model = Task
        fields = ['id', 'text', 'is_done', 'priority', 'expiry_date']


class ProjectSerializer(serializers.ModelSerializer):
    """ PROJECT """
    tasks = TaskSerializer(many=True, required=False)

    class Meta:
        model = Project
        fields = ['id', 'name', 'tasks']
