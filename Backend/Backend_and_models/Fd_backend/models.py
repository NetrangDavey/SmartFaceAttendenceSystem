from django.db import models


class Students(models.Model):
    name=models.CharField(max_length=50,null=False)
    reg_no=models.CharField(max_length=16,null=False)