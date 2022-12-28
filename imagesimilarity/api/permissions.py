from rest_framework import permissions


class IsAdmin(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return request.user.is_admin

    def has_permission(self, request, view):
        return request.user.is_admin


class IsOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        print("Request user: ", request.user.owner)
        print("Request obj: ", type(obj.owner), obj.owner)
        for item in obj.owner:
            print(item)
        return request.user.owner == obj.owner.username