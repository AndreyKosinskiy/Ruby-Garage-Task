from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Project(models.Model):
    """ PROJECT """
    name = models.CharField(max_length=256)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self):
        return self.name


class Task(models.Model):
    """ Tasks """
    text = models.CharField(max_length=256)
    board = models.ForeignKey(Project, related_name="tasks", on_delete=models.CASCADE)
    is_done = models.BooleanField(default=False)
    priority = models.SmallIntegerField(default=1)
    expiry_date = models.DateTimeField(verbose_name="deadline", null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.text

    class Meta:
        ordering = ['board', 'priority']
