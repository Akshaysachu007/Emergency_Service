from django.shortcuts import render
from django.db.models.functions import TruncMonth
from rest_framework import generics
from django.contrib.auth.models import User
from math import radians, sin, cos, sqrt, atan2
from .serializers import (CustomerAllServiceRequestSerializer, CustomerCompletedRequestSerializer, NotificationSerializer, ProfileSerializer, ProviderDetailSerializer, ProviderListSerializer, ServiceCategorySerializer, ServiceRequestCompletedSerializer, ServiceRequestSerializer
, RegisterSerializer , 
CustomerRegisterSerializer ,
ProviderRegisterSerializer,
ServiceRequestCreateSerializer,
ServiceRequestListSerializer,
CustomerRequestSerializer,
ReviewSerializer,
ReviewListSerializer,
ProviderProfileSerializer,BookProviderSerializer,
ProviderAllServiceRequestListSerializer,
ReviewListProviderSerializer,)
from .models import Notification, Profile, Review, ServiceRequest , ProviderProfile ,ServiceCategory
from rest_framework.views import APIView, Http404
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.db.models import Avg, Count

# Create your views here.



def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1))
        * cos(radians(lat2))
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return round(R * c, 2)


class ServiceRequestListCreateView(generics.ListCreateAPIView):
    queryset = ServiceRequest.objects.all()
    serializer_class = ServiceRequestSerializer



class RegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer    
    
    
    
#Customer Registration View    
class CustomerRegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = CustomerRegisterSerializer    
    
    
#Provider Registration View    
class ProviderRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = ProviderRegisterSerializer  
    
    
    
#Test Authenticated View    
class TestAuth(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({"message": f"Hello, {request.user.username}! You are authenticated."})      
    
    
    
#Service Request Create View    
class ServiceRequestCreateView(generics.CreateAPIView):
    
    serializer_class = ServiceRequestCreateSerializer 
    
    permission_classes = [IsAuthenticated]
    
    def perform_create(self , serializer):
        category = ServiceCategory.objects.get(id=self.kwargs['category_id'])
        service_request =serializer.save(customer=self.request.user ,category = category)
        
        providers = ProviderProfile.objects.filter(category=category, is_verified=True).select_related("user")
        
        notifications = []
        for provider in providers:
            notifications.append(Notification(
                user=provider.user,
                title="New Service Request",
                message=f"You have a new service request from {self.request.user.username} in category {category.name}."
            ))
        
        Notification.objects.bulk_create(notifications)
        
        return service_request
        
        
        
#List Service Requests for Providers        
class ServiceRequestListView(generics.ListAPIView):
    serializer_class = ServiceRequestListSerializer
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        
        try: 
           provider_profile = ProviderProfile.objects.get(user = self.request.user)
        
           return ServiceRequest.objects.filter(
              category_id = provider_profile.category_id,
              status = "pending"
            ).select_related('customer').order_by("-created_at")
           
        except ProviderProfile.DoesNotExist:
            return ServiceRequest.objects.none()   
        
        
        
        
#Acceptinng the Service Request by the provider        
class AcceptServiceRequestView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self , request , request_id):
        try:
            service_request = ServiceRequest.objects.get(id=request_id)    
        except ServiceRequest.DoesNotExist:
            return Response({"error": "Service request not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if service_request.status !="pending":
            return Response({"error": "Service request is not pending"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            provider_profile = ProviderProfile.objects.get(user = request.user)
        except ProviderProfile.DoesNotExist:
            return Response({"error": "Provider profile not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if service_request.category != provider_profile.category:
            return Response({"error": "You are not authorized to accept this request"}, status=status.HTTP_403_FORBIDDEN)
        
        if not provider_profile.is_verified:
            return Response({"error": "Your profile is not verified. You cannot accept service requests."}, status=status.HTTP_403_FORBIDDEN)
        
        service_request.provider = request.user
        service_request.status = "accepted"
        service_request.save()
        
        Notification.objects.create(
            user=service_request.customer,
            title="Service Request Accepted",
            message=f"Your service request has been accepted by {request.user.username}.",
        )
        
        return Response({"message": "Service request accepted successfully",
                         "request_id": service_request.id,
                         "provider": request.user.username,
                         "current_status": service_request.status
                         }, status=status.HTTP_200_OK)    
        
        
#Customer request Service list
class CustomerServiceRequestListView(generics.ListAPIView):
    serializer_class = ServiceRequestListSerializer
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self): 
        try:
            return ServiceRequest.objects.select_related('customer', 'category').filter(customer = self.request.user)        
        except ServiceRequest.DoesNotExist:
            return ServiceRequest.objects.none()    
        
        
#Accepted Service Request List for Providers
class ProviderAcceptedServiceRequestListView(generics.ListAPIView):
    serializer_class = ServiceRequestListSerializer
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            provider_profile = ProviderProfile.objects.get(user = self.request.user)
            return ServiceRequest.objects.select_related('customer', 'category').filter(
                provider = provider_profile.user,
                status = "accepted"
            ).order_by("-created_at")
        except ProviderProfile.DoesNotExist:
            return ServiceRequest.objects.none()  
        
        
class CompleteRequestView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self , request , request_id):
        try:
            service_request = ServiceRequest.objects.get(id=request_id)
        except ServiceRequest.DoesNotExist:
            return Response({"error": "Service request not found"},
                            status=status.HTTP_404_NOT_FOUND)              
        
        if service_request.status != "accepted":
            return Response({"error": "Service request is not accepted"}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        if service_request.provider != request.user:
            return Response({"error": "You are not authorized to complete this request"},
                            status=status.HTTP_403_FORBIDDEN)
        service_request.provider = request.user
        service_request.status = "completed"
        service_request.save()
        
        provider_profile = ProviderProfile.objects.get(user = request.user)
        provider_profile.total_jobs_completed += 1
        provider_profile.save()
        
        
        return Response({"message": "Service request marked as completed",
                         "request_id": service_request.id,},status=status.HTTP_200_OK)    
        
        
        
class CustomerRequestListView(generics.ListAPIView):
    serializer_class = CustomerRequestSerializer
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            return ServiceRequest.objects.filter(customer = self.request.user).order_by("-created_at")
        except ServiceRequest.DoesNotExist:
            return ServiceRequest.objects.none()
        
        
        
 #Creating Review for the completed service request by the customer       
class CreateReviewView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]        
    
    
 #List of Reviews by the customer   
class CustomerReviewList(generics.ListAPIView):
    serializer_class = ReviewListSerializer
    permission_classes = [IsAuthenticated] 
    
    def get_queryset(self):
        try:
            return Review.objects.filter(customer=self.request.user).order_by("-created_at")  
        except Review.DoesNotExist:
            return Review.objects.none()
 
 
 
 #List of reviews for the provider       
class ProviderReviewList(generics.ListAPIView):
    serializer_class = ReviewListSerializer
    permission_classes = [IsAuthenticated] 
    
    def get_queryset(self):
        try:
            return Review.objects.filter(provider=self.request.user).order_by("-created_at")  
        except Review.DoesNotExist:
            return Review.objects.none() 
        
 
 
 #completed service request list for the provider  
      
class ProviderCompletedServiceView(generics.ListAPIView):
    serializer_class = ServiceRequestListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            return ServiceRequest.objects.filter(provider=self.request.user, status="completed").order_by("-created_at")
        except ServiceRequest.DoesNotExist:
            return ServiceRequest.objects.none()  
        
     
     
        
# Customer Completed Services

class CustomerCompletedServiceView(generics.ListAPIView):
    serializer_class = ServiceRequestListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            return ServiceRequest.objects.filter(customer=self.request.user, status="completed").order_by("-created_at")
        except ServiceRequest.DoesNotExist:
            return ServiceRequest.objects.none()                      
            
            
class ProviderProfileView(generics.RetrieveAPIView):
    serializer_class = ProviderListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        try:
            provider_profile = ProviderProfile.objects.get(user=self.request.user)
            return provider_profile
        except ProviderProfile.DoesNotExist:
            raise Http404("Provider profile not found")
        
  
  
  
  #provider dashboard
        
class ProviderDashboardView(APIView):
    permission_classes = [IsAuthenticated] 
    
    def get(self , request):
        try:
            provider_profile = ProviderProfile.objects.get(user = request.user)
        except ProviderProfile.DoesNotExist:
            return Response({"error": "Provider profile not found"}, status=status.HTTP_404_NOT_FOUND)
        
        available_requests = ServiceRequest.objects.filter(
            category = provider_profile.category,
            status = "pending"
        ).count()    
        
        completed_jobs = ServiceRequest.objects.filter(
            provider = request.user,
            status = "completed"
        ).count()       
        
        average_rating = provider_profile.rating
        
        accepted_jobs = ServiceRequest.objects.filter(
            provider = request.user,
        )
        
        data = {
            "available_requests": available_requests,
            "accepted_jobs": accepted_jobs,
            "completed_jobs": completed_jobs,
            "rating": average_rating,
            "total_jobs_completed": provider_profile.total_jobs_completed,
            "is_verified": provider_profile.is_verified,
            "category": provider_profile.category.name,
        }
        
        return Response(data , status=status.HTTP_200_OK)
    
    
class ProviderListView(generics.ListAPIView):
    serializer_class = ProviderProfileSerializer
    permission_classes = [IsAuthenticated]
    
    queryset = ProviderProfile.objects.filter(is_verified=True).select_related("user", "category").order_by("-rating")   
    
    
 # to list service by category   
class ServiceCategoryListView(generics.ListAPIView):
    serializer_class = ServiceCategorySerializer
    permission_classes = [IsAuthenticated]
    
    queryset = ServiceCategory.objects.all().order_by("name")
        
        
class CancelServiceRequestView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self , request , request_id):
        try:
            service_request = ServiceRequest.objects.get(id = request_id)
        except ServiceRequest.DoesNotExist:
            return Response({"error": "Service request not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if service_request.customer != request.user:
            return Response({"error": "You are not authorized to cancel this request"}, status=status.HTTP_403_FORBIDDEN)            
        
        if service_request.status != "pending":
            return Response({"error": "Only pending requests can be cancelled"}, status=status.HTTP_400_BAD_REQUEST)
        
        service_request.status = "cancelled"
        service_request.save()
        
        category = service_request.category
        providers = ProviderProfile.objects.filter(category=category, is_verified=True).select_related("user")
        
        notifications = []
        for provider in providers:
            notifications.append(Notification(
                user=provider.user,
                title="Service Request Cancelled",
                message=f"The service request from {request.user.username} in category {category.name} has been cancelled."
            ))
            
        Notification.objects.bulk_create(notifications)    
        
        
        
        return Response({"message": "Service request cancelled successfully",
                         "request_id": service_request.id,
                         "current_status": service_request.status
                         }, status=status.HTTP_200_OK)
        
        
        
class ProviderDetailsView(generics.RetrieveAPIView):
    serializer_class = ProviderDetailSerializer
    permission_classes = [IsAuthenticated]
    queryset = ProviderProfile.objects.filter(is_verified=True).select_related("user", "category")
    
    
# profile serializer view for role based dashboard
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self , request):
        try:
            profile = Profile.objects.get(user = request.user)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ProfileSerializer( profile )
        
        return Response(serializer.data , status=status.HTTP_200_OK)    
    
    


#category list for provider registration without authentication
class ServiceCategoryListPublicView(generics.ListAPIView):
    serializer_class = ServiceCategorySerializer
    queryset = ServiceCategory.objects.all().order_by("name")    
    



class ProviderCompletedRequestsListView(generics.ListAPIView):
    serializer_class = ServiceRequestCompletedSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            return ServiceRequest.objects.filter(
                provider = self.request.user,
                status = "completed"
            ).select_related("customer" , "category").order_by("-created_at")
        except ServiceRequest.DoesNotExist:
            return ServiceRequest.objects.none()  
        


class CustomerCompletedRequestsListView(generics.ListAPIView):
    serializer_class = CustomerCompletedRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            return ServiceRequest.objects.filter(customer = self.request.user , status = "completed").select_related("provider" , "category" , "provider__profile").order_by("-created_at")
        except ServiceRequest.DoesNotExist:
            return ServiceRequest.objects.none()
        

class CustomerAllRequestsListView(generics.ListAPIView):
    serializer_class = CustomerAllServiceRequestSerializer     
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
      
        return ServiceRequest.objects.filter(customer = self.request.user).select_related("provider" , "category" , "provider__profile" ).order_by("-created_at")
        
#CustomerProfileDetailsView
class CustomerProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        try:
            profile = Profile.objects.get(user = self.request.user)
            return profile
        except Profile.DoesNotExist:
            raise Http404("Profile not found")        
        
        
class ProviderListView(generics.ListAPIView):
    serializer_class = ProviderProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def list(self,request,*args,**kwargs):
        
        customer_lat = request.GET.get("lat") 
        customer_lon = request.GET.get("lng")
        
        providers = ProviderProfile.objects.filter(is_verified=True).select_related("user" , "category")
        
        if customer_lat and customer_lon:
            for provider in providers:
                if provider.latitude and provider.longitude:
                    provider.distance = calculate_distance(float(customer_lat), float(customer_lon), float(provider.latitude), float(provider.longitude))
                else:
                    provider.distance = None
                    
            providers = sorted(providers, key=lambda x: (x.distance is None, x.distance))
        
        serializer = self.get_serializer(providers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)    
      
                    
    
    
    #booking direct provider
class BookProviderView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BookProviderSerializer   
    
    def create(self, request , *args , **kwargs):
        provider_id = self.kwargs['provider_id']
        
        try:
            provider = ProviderProfile.objects.get(id = provider_id , is_verified=True)
        except ProviderProfile.DoesNotExist:
            return Response({"error": "Provider not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(data=request.data , context ={
            "provider": provider,
            "request": request
        })    
        
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({
            "message" :  "Service request created successfully",
            "request_id": serializer.instance.id,
        } ,  status=status.HTTP_201_CREATED)
        



#View For Provider for listing all the service requests assigned to them
class ProviderAllRequestsListView(generics.ListAPIView):
    serializer_class = ProviderAllServiceRequestListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            return ServiceRequest.objects.filter(provider = self.request.user).select_related("customer" , "category").order_by("-created_at")
        except ServiceRequest.DoesNotExist:
            return ServiceRequest.objects.none()
        
        
        
  #View for Provider Analytics and Dashboard Summary      
class ProviderAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self , request):
        
        queryset = ServiceRequest.objects.filter(provider = request.user)
        total_requests = queryset.count()
        accepted_requests = queryset.filter(status = "accepted").count()
        completed_requests = queryset.filter(status = "completed").count()
        pending_requests = queryset.filter(status = "pending").count()
        average_rating = Review.objects.filter(provider = request.user).aggregate(Avg("rating"))["rating__avg"] or 0
        
        monthly_requests = (
            queryset 
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(count=Count("id"))
            .order_by("month")
        )
        
        monthyly_data = [
            {
                "month": item["month"].strftime("%b"),
                "count": item["count"]
            }
            for item in monthly_requests
        ]
        
        
        return Response({
            "total_requests": total_requests,
            "accepted_requests": accepted_requests,
            "completed_requests": completed_requests,
            "pending_requests": pending_requests,
            "average_rating": round(average_rating, 1),
            
            
            "status_distribution": {
                "accepted": accepted_requests,
                "completed": completed_requests,
                "pending": pending_requests
            },
            
            "monthly_requests": monthyly_data
            
            
        } , status=status.HTTP_200_OK)
        
        
        
class ReviewListProviderView(generics.ListAPIView):
    serializer_class = ReviewListProviderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        
        return Review.objects.filter(provider = self.request.user).select_related("customer").order_by("-created_at")
    

class ProviderProfileView(generics.RetrieveAPIView):
    serializer_class = ProviderProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return ProviderProfile.objects.select_related(
            "user",
            "user__profile",
            "category"
        ).get(user=self.request.user)
        
        
        
class CustomerProfileDataView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self , request):
        requests = ServiceRequest.objects.filter(customer = request.user)
        
        data = {
            "total_requests": requests.count(),
            "pending_requests": requests.filter(status="pending").count(),
            "accepted_requests": requests.filter(status="accepted").count(),
            "completed_requests": requests.filter(status="completed").count(),
            "cancelled_requests": requests.filter(status="cancelled").count(),
        }        
        return Response(data, status=status.HTTP_200_OK)
    
    
class NotficationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by("-created_at")    
    
class NotificationUnreadCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self , request):
        unread_count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({"unread_count": unread_count}, status=status.HTTP_200_OK)



class GetCurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        role = User.objects.get(id=request.user.id).profile.role
        return Response({"username": request.user.username, "role": role}, status=status.HTTP_200_OK)
    
class MarkNotificationsReadView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self,request):
        Notification.objects.filter(user=request.user , is_read=False).update(is_read=True)   
        return Response({"message": "All notifications marked as read"}, status=status.HTTP_200_OK) 
    
    
#Provider Location Update View
class ProviderLocationUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request):
        try:
            provider = ProviderProfile.objects.get(user=request.user)
        except ProviderProfile.DoesNotExist:
            return Response({"error": "Provider profile not found"}, status=status.HTTP_404_NOT_FOUND)
        
        latitude = request.data.get("latitude")
        longitude = request.data.get("longitude")
        
        if latitude is not None:
            provider.latitude = latitude
            
        if longitude is not None:
            provider.longitude = longitude
            
        provider.save()
        
        return Response({"message": "Location updated successfully"}, status=status.HTTP_200_OK)                