from rest_framework.routers import DefaultRouter
from .views import ProjectView, TaskView

router = DefaultRouter()
router.register('project', ProjectView, basename='project')
router.register('task', TaskView, basename='task')
urlpatterns = router.urls
