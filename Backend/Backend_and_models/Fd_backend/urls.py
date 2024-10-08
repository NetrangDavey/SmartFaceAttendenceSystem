from django.urls import path
from .views import mark_attendance,register

urlpatterns = [
    path('register',register,name="register"),
    path('mark_attendence',mark_attendance,name="attendence")
]