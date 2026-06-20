from django.db import models
from django.contrib.auth.models import User
# Create your models here.


#PROFILE MODEL

class Profile(models.Model):
    
    ROLE_CHOICES = (
        ("customer", "Customer"),
        ("provider", "Provider"),
    )    
    
    user = models.OneToOneField(User, 
                                on_delete=models.CASCADE)
    
    role = models.CharField(max_length=20, 
                            choices=ROLE_CHOICES)
    
    phone = models.CharField(max_length=20)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    def __str__(self):
        return self.user.username
    


#SERVICE CATEGORY MODEL
   
class ServiceCategory(models.Model):
    
    name = models.CharField(max_length=50 , unique=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name    
    


#provider profile
class ProviderProfile(models.Model):
    
    user = models.OneToOneField(User, 
                                on_delete=models.CASCADE)
    
    category = models.ForeignKey(ServiceCategory,
                                 on_delete=models.CASCADE,
                                 related_name='providers')
    
    is_verified = models.BooleanField(default=False)
    
    rating = models.DecimalField(default=0.0, max_digits=2, decimal_places=1)
    
    
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )
    
    total_jobs_completed = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
     
    def __str__(self):
        return self.user.username





#SERVICE REQUEST MODEL


class ServiceRequest(models.Model):
    
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("accepted", "Accepted"),   
        ("completed", "Completed"),
        ("cancelled","Cancelled")
    )
    
    customer = models.ForeignKey(User,
                                 on_delete=models.CASCADE,
                                 related_name='customer_requests',
                                 )
    
    
    category = models.ForeignKey( ServiceCategory,
                                 on_delete=models.CASCADE,
                                 related_name='service_requests')
    
    description = models.TextField()
    
    provider = models.ForeignKey(User,
                                 on_delete=models.SET_NULL,
                                 blank=True,
                                 null=True,
                                 related_name='provider_requests')
    
    status = models.CharField(max_length=20, 
                              choices=STATUS_CHOICES,
                              default='pending')
    
    latitude = models.DecimalField(max_digits=9, decimal_places=6 , null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    def __str__(self):
        return f"{self.customer.username} - {self.category.name}"
    
    
class Review(models.Model):
    
    service_request = models.OneToOneField(ServiceRequest,
                                         on_delete=models.CASCADE,related_name ='review')
    
    provider = models.ForeignKey(User,
                                 on_delete=models.CASCADE,
                                 related_name='ratings_received')
    
    customer = models.ForeignKey(User,
                                 on_delete=models.CASCADE,
                                 related_name='ratings_given')
    
    rating = models.PositiveSmallIntegerField()
    
    comments = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Rating for {self.provider.username} by {self.customer.username}"
    
    
    
#Notification Model

class Notification(models.Model):
    
    user = models.ForeignKey(User , on_delete=models.CASCADE, related_name='notifications')
    
    message = models.CharField(max_length=255)   
    title = models.CharField(max_length=255, default="New Notification")
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Notification for {self.user.username}: {self.title}"     
 