from django.urls import path
from . import views

urlpatterns = [
    path('place_order/', views.place_order, name='place_order'),
    path('payments/', views.payments, name='payments'),
    path('order_complete/', views.order_complete, name='order_complete'),
    path('cancel/', views.cancel, name='cancel'),
    path('paymob/', views.paymob, name='paymob'),
    path('post/', views.post, name='post'),

]

