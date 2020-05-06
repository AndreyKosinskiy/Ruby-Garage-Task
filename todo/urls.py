from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ProjectView, TaskView, UserList,current_user

router = DefaultRouter()
router.register('project', ProjectView, basename='project')
router.register('task', TaskView, basename='task')
urlpatterns = [
    path('users/', UserList.as_view()),
    path('current_user/', current_user),
]
urlpatterns += router.urls
