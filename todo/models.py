from django.db import models


# Create your models here.
class Project(models.Model):
    """ Проект """
    name = models.CharField(max_length=256)

    def __str__(self):
        return self.name


class Task(models.Model):
    """ Задание """
    text = models.CharField(max_length=256)
    board = models.ForeignKey(Project, related_name="tasks", on_delete=models.CASCADE)
    is_done = models.BooleanField(default=False)
    priority = models.SmallIntegerField(default=1)
    expiry_date = models.DateTimeField(verbose_name="deadline", null=True)

    def __str__(self):
        return self.text

    class Meta:
        ordering = ['board', 'priority']
