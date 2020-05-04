from rest_framework import serializers
from .models import Project, Task


class TaskSerializer(serializers.ModelSerializer):
    """ Задание """
    class Meta:
        model = Task
        fields = ['id', 'text', 'is_done', 'priority', 'expiry_date']


class ProjectSerializer(serializers.ModelSerializer):
    """ Проект """
    tasks = TaskSerializer(many=True, required=False)

    class Meta:
        model = Project
        fields = ['id', 'name', 'tasks']
