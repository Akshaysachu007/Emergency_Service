import profile

from django.contrib import admin
from .models import ServiceRequest , Profile , ServiceCategory , ProviderProfile , Review 

# Register your models here.

admin.site.register(ServiceRequest)
admin.site.register(Profile)
admin.site.register(ServiceCategory)
admin.site.register(ProviderProfile)
admin.site.register(Review)
