from rest_framework import serializers
from .models import ServiceRequest, Profile ,ServiceCategory , ProviderProfile , Review ,Notification
from django.contrib.auth.models import User
from django.db.models import Avg


#SERVICE REQUEST SERIALIZER
class  ServiceRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRequest
        fields = '__all__'
        

        
#Registration Serializer
class RegisterSerializer(serializers.ModelSerializer):
    
    #making password write only to ensure it is not exposed in API responses
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User 
        fields = [
            "username",
            "email",    
            "password",
        ]     
        
    def create(self,validated_data):
        user = User.objects.create_user(
            username = validated_data["username"],
            email = validated_data["email"],
            password = validated_data["password"],
        )     
        
        return user
    
    
    
    #Customer Registration Serializer
class CustomerRegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20 , write_only=True)    
    password = serializers.CharField(write_only=True)
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value
    
    def validate_phone(self, value):
        if Profile.objects.filter(phone=value).exists():
            raise serializers.ValidationError("Phone number already exists")
        return value
    
    def create(self , validated_data):
        user = User.objects.create_user(
            username = validated_data["username"],
            email = validated_data["email"],
            password = validated_data["password"],
        )
        
        Profile.objects.create(
            user=user,
            role="customer",
            phone=validated_data["phone"],
        )
        
        return user
    
    
    
#Provider Registration Serializer
class ProviderRegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20 , write_only=True)
    password = serializers.CharField(write_only=True)  
    category = serializers.IntegerField(write_only=True)  
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
         raise serializers.ValidationError("Username already exists")
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value
    
    def validate_phone(self, value):
        if Profile.objects.filter(phone=value).exists():
            raise serializers.ValidationError("Phone number already exists")
        return value
    
    def validate_category(self, value):
        if not ServiceCategory.objects.filter(id=value).exists():
            raise serializers.ValidationError("Invalid service category")
        return value
    
    def create(self , validated_data):
        
        category = ServiceCategory.objects.get(id = validated_data["category"])
        
        user = User.objects.create_user(
            username = validated_data["username"],
            email = validated_data["email"],
            password = validated_data["password"],
        )
        
        Profile.objects.create(
            user=user,
            role="provider",
            phone=validated_data["phone"],  
        )
        
        ProviderProfile.objects.create(
            user=user,
            category=category,
        )
        
        return user


#Service Request Create Serializer
class ServiceRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRequest
        fields = [
            "description",
            "longitude",
            "latitude",
        ]
    
        
        
        
 #service request list serializer with nested category and customer details       
class ServiceRequestListSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='category.name',read_only=True)  
    
    customer = serializers.CharField(source='customer.username',read_only=True)
    customer_phone = serializers.CharField(source='customer.profile.phone', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    customer_location = serializers.SerializerMethodField()
    
    class Meta:
        model = ServiceRequest
        fields = [
            "id",
            "customer",
            "category",
            "customer_phone",
            "customer_email",
            "description",
            "status",
            "created_at",
            "customer_location"
        ]
        
    def get_customer_location(self , obj):
        return {
            "latitude": obj.latitude,
            "longitude": obj.longitude
        }    
        
        
#Customer Service Request List Serializer with provider details       
class CustomerRequestSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='category.name',read_only=True)  
    provider = serializers.SerializerMethodField()  
    
    
    class Meta:
        model = ServiceRequest
        fields = [
            "id",
            "provider",
            "category",
            "description",
            "status",
            "created_at",
        ]
        
    def get_provider(self , obj):
        if obj.provider:
            return obj.provider.username
        return None          
 
 
 
        
#Review Serializers

class ReviewSerializer(serializers.Serializer):
    
    service_request_id = serializers.IntegerField(write_only=True)
    rating = serializers.IntegerField(min_value=1, max_value=5)
    comments = serializers.CharField(allow_blank=True, required=False)  
    
    
    def create(self, validated_data):
        user = self.context['request'].user
        try:
            service_request = ServiceRequest.objects.get(id=validated_data['service_request_id'])
        except ServiceRequest.DoesNotExist:
            raise serializers.ValidationError("Service request not found")
        if service_request.customer != user:
            raise serializers.ValidationError("You can only review your own service requests")
        
        if service_request.status != "completed":
            raise serializers.ValidationError("You can only review completed service requests")
        
        if Review.objects.filter(service_request=service_request).exists():
            raise serializers.ValidationError("You have already reviewed this service request")
        
        review = Review.objects.create(
            service_request=service_request,
            customer=user,
            provider=service_request.provider,
            rating=validated_data['rating'],
            comments=validated_data.get('comments', '')
        )
        
        provider_profile = ProviderProfile.objects.get(user=service_request.provider)
        provider_profile.rating = Review.objects.filter(provider=service_request.provider).aggregate(Avg('rating'))['rating__avg']
        provider_profile.save()
        
        return review
    
class ReviewListSerializer(serializers.ModelSerializer):
    customer = serializers.CharField(source='customer.username' , read_only=True)
    provider = serializers.CharField(source='provider.username' , read_only=True)
    
    class Meta:
        model = Review
        fields = [
            "id",
            "customer",
            "provider",
            "rating",
            "comments",
            "created_at",
        ]
        
        
    
    
class ProviderProfileSerializer(serializers.ModelSerializer):

    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.CharField(source="user.email", read_only=True)
    phone = serializers.CharField(source="user.profile.phone", read_only=True)
    role = serializers.CharField(source="user.profile.role", read_only=True)
    category = serializers.CharField(source="category.name", read_only=True)
    distance = serializers.FloatField(read_only=True)

    class Meta:
        model = ProviderProfile
        fields = [
            "id",
            "username",
            "email",
            "phone",
            "role",
            "category",
            "rating",
            "total_jobs_completed",
            "is_verified",
            "distance",
        ]    

#Providers list for cutomers
class ProviderListSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    category = serializers.CharField(source='category.name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.profile.phone', read_only=True)
    
    
    class Meta:
        model = ProviderProfile
        fields = [
            "id",
            "username",
            "email",
            "phone",
            "category",
            "rating",
            "total_jobs_completed",
            "is_verified",
        ]
        

# to list service by category
class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = [
            "id",
            "name",
        ]        
        
   
#Review Serializers        
class ProviderReviewSerializer(serializers.ModelSerializer):
    
    customer = serializers.CharField(source='customer.username' , read_only=True)
    
    class Meta:
        model = Review
        fields = [
            "id",
            "customer",
            "rating",
            "comments",
            "created_at",
        ]
    
    
    
 #provider details with nested review serializer       
class ProviderDetailSerializer(serializers.ModelSerializer):
    
    provider = serializers.CharField(source="user.username" , read_only=True)
    category = serializers.CharField(source="category.name" , read_only=True)
    
    reviews = serializers.SerializerMethodField()
    
    class Meta:
        model = ProviderProfile
        fields = [
            "username",
            "category",
            "rating",
            "total_jobs_completed",
            "is_verified",
            "reviews",
        ]
        
        
    def get_reviews(self , obj):
        reviews = Review.objects.filter(provider=obj.user).order_by("-created_at")
        return ProviderReviewSerializer(reviews , many=True).data    
            
        
        
        
#profile serializer for role based dashboard
class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username' , read_only=True)
    email = serializers.CharField(source='user.email' , read_only=True)
    
    class Meta:
        model = Profile
        fields = [
            "username",
            "email",
            "role",
            "phone",
            "created_at",
        ]            
        


#review list serializer for completed requests
class ReviewSerializerCompletedRequests(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            "rating",
            "comments",
            "created_at",
        ]


#list of completed service requests with nested review serializer        
class ServiceRequestCompletedSerializer(serializers.ModelSerializer):
        review = ReviewSerializerCompletedRequests(read_only=True)
        customer = serializers.CharField(source='customer.username', read_only=True)
        category = serializers.CharField(source='category.name', read_only=True)
        
        class Meta:
            model = ServiceRequest
            fields = [
                "id",
                "customer",
                "category",
                "description",
                "status",
                "created_at",
                "review",
            ]       
            
            
            
  #Completed Service Request list for customers with review status          
class CustomerCompletedRequestSerializer(serializers.ModelSerializer):
    
    
    review = ReviewSerializerCompletedRequests(read_only=True)
    provider = serializers.CharField(source='provider.username', read_only=True)
    category = serializers.CharField(source='category.name', read_only=True)
    provider_email = serializers.CharField(source='provider.email', read_only=True)
    provider_phone = serializers.CharField(source='provider.profile.phone', read_only=True)
    
    class Meta:
        model = ServiceRequest
        fields = [
            "id",
            "provider",
            "category",
            "description",
            "provider_email",
            "provider_phone",
            "status",
            "created_at",
            "review",
        ]
        
        
class CustomerAllServiceRequestSerializer(serializers.ModelSerializer):
    provider = serializers.SerializerMethodField()        
    category = serializers.CharField(source="category.name" , read_only=True)
    provider_email = serializers.SerializerMethodField()
    provider_phone = serializers.SerializerMethodField()
    review = ReviewSerializerCompletedRequests(read_only=True)
    
    class Meta:
        model = ServiceRequest
        fields = [
            "id",
            "provider",
            "category",
            "description",
            "provider_email",
            "provider_phone",
            "status",
            "created_at",
            "review",
        ]
        
    def get_provider(self , obj):
        if obj.provider:
            return obj.provider.username
        return None
    
    def get_provider_email(self , obj):
        if obj.provider:
            return obj.provider.email
        return None
    
    def get_provider_phone(self , obj):
        if obj.provider and hasattr(obj.provider, 'profile'):
            return obj.provider.profile.phone
        return None    
    
    
    
#Provider Direct Booking Serializer    
class BookProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRequest
        fields = [
            "description",
            "longitude",
            "latitude",
        ]    
        
    def create(self, validated_data):
        user = self.context['request'].user
        provider = self.context['provider']
        
        service_request = ServiceRequest.objects.create(
            customer=user,
            provider=provider.user,
            category=provider.category,
            description=validated_data['description'],
            longitude=validated_data['longitude'],
            latitude=validated_data['latitude'],
            status='pending',
        )   
        
        Notification.objects.create(
            user=service_request.provider,
            title="New Booking Request",
            message=f"You have a new booking request from {user.username}.",
        )
        
        return service_request
        
      
         
        
    
    
class ProviderAllServiceRequestListSerializer(serializers.ModelSerializer):
    customer = serializers.CharField(source='customer.username', read_only=True)
    category = serializers.CharField(source='category.name', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    customer_phone = serializers.CharField(source='customer.profile.phone', read_only=True)
    review = ReviewSerializerCompletedRequests(read_only=True)

    class Meta:
        model = ServiceRequest
        fields = [
            "id",
            "customer",
            "category",
            "description",
            "customer_email",
            "customer_phone",
            "longitude",
            "latitude",
            "status",
            "created_at",
            "review",
        ]
    
    
    
    
    
class ReviewListProviderSerializer(serializers.ModelSerializer):
    customer = serializers.CharField(source='customer.username' , read_only=True)
    
    class Meta:
        model = Review
        fields = [
            "id",
            "customer",
            "rating",
            "comments",
            "created_at",
        ]
        
        
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            "id",
            "title",
            "message",
            "is_read",
            "created_at",
        ]        