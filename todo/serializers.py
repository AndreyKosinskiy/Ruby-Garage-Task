from rest_framework import serializers
from .models import Project, Task


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
