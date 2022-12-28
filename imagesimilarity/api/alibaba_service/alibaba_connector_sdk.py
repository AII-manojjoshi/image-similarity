from . import config as c
from pathlib import Path
from alibabacloud_imagesearch20201214.client import Client
from alibabacloud_imagesearch20201214 import models
from alibabacloud_tea_openapi.models import Config
from alibabacloud_oss_util.models import RuntimeOptions


class AlibabaService:
    def __init__(self, endpoint=c.IS_ENDPOINT, access_key=c.IS_ACCESS_KEY, secret_key=c.IS_SECRET_KEY,
                 region=c.IS_REGION, instance_name=c.IS_INSTANCE_NAME, instance_id=c.IS_INSTANCE_ID):
        """
        ALibaba Product Search Instance Interface class using the Python SDK V3
        @Ref https://www.alibabacloud.com/help/en/image-search
        @Ref https://www.alibabacloud.com/help/en/image-search/latest/version-v3-python-sdk
        """
        config = Config()
        config.access_key_id = access_key
        config.access_key_secret = secret_key
        self.base_url, config.endpoint = endpoint, endpoint
        self.region, config.region_id = region, region
        config.type = 'access_key'
        self.client = Client(config)
        self.instance_name = instance_name
        self.instance_id = instance_id


    def __str__(self):
        return f"base_url: {self.base_url}" \
               f"region: {self.region}" \
               f"instance_name: {self.instance_name}" \
               f"instance_id: {self.instance_id}"

    def __repr__(self):
        return f"AlibabaService(self, base_url={self.base_url}, " \
               f"access_key={self.client.get_access_key_id()}, " \
               f"secret_key={self.client.get_access_key_secret()}, " \
               f"region={self.region}, " \
               f"instance_name={self.instance_name}, " \
               f"instance_id={self.instance_id})"

    def add_image(self, product_id, pic_name, filepath, custom_content=None,
                  int_attr=None, str_attr=None, crop=True, region=None, category_id=88888888):
        """
        Adds a new image to the search pool
        @params Required
        product_id The unique id for each image
        pic_name The name of the image
        filepath The path of the image file
        @Params Optional
        category_id The label id for the image
        custom_content The comment on the image e.g. description
        int_attr User id. To search for images specific to users
        string_attr Attributes of image. It can be used in image search
        crop Default is True. It is used in object recognition and hence image search using the object if false
                              the entire image is used to search
        region The custom search region. If this is set. The search uses this region parameter
        """
        request = models.AddImageAdvanceRequest()
        request.instance_name = self.instance_name
        request.product_id = product_id
        request.pic_name = pic_name
        f = open(str(str(Path().absolute())+"/"+filepath), "rb")
        request.pic_content_object = f
        request.category_id = category_id
        request.int_attr = int_attr
        request.custom_content = custom_content
        request.str_attr = str_attr
        request.crop = crop
        request.region = region
        status, image_add_response = self._do_request(self.client.add_image_advance, request, RuntimeOptions())
        f.close()
        return status, image_add_response

    def search_image_by_pic(self, filepath, category_id=88888888, crop=True, region=None,
                             num=10, start=0, query_filter=None):
        """
        Searches images by names from the pool of added images
        @params Required
        filepath The path of the image file
        @Params Optional
        category_id The label id for the image
        crop Default is True. It is used in object recognition and hence image search using the object if false
                              the entire image is used to search
        region The custom search region. If this is set. The search uses this region parameter
        num The number of entries to be returned. Valid values: 1 to 100. Default value: 10.
        start The ordinal number of the first entry that is returned. Valid values: 0 to 499. Default value: 0.
        query_filter Filter conditions using int_attr and string_attr. Supports logical operations >, >=, <, <=, and =
        """
        request = models.SearchImageByPicAdvanceRequest()
        request.instance_name = self.instance_name
        # f = open(str(str(Path().absolute())+'/ImageSimilarityAlibabaCloud/'+filepath), "rb")
        f = open(filepath, "rb")
        request.pic_content_object = f
        request.category_id = category_id
        request.num = num
        request.start = start
        request.filter = query_filter
        request.crop = crop
        request.region = region
        status, search_response = self._do_request(self.client.search_image_by_pic_advance, request, RuntimeOptions())
        f.close()
        return status, search_response

    def search_image_by_name(self, product_id, pic_name, category_id=None, crop=True, region=None,
                             num=10, start=0, query_filter=None):
        """
        Searches images by image from the pool of added images
        @params Required
        product_id The id of the product
        pic_name The name of the image
        @Params Optional
        category_id The label id for the image
        crop Default is True. It is used in object recognition and hence image search using the object if false
                              the entire image is used to search
        region The custom search region. If this is set. The search uses this region parameter
        num The number of entries to be returned. Valid values: 1 to 100. Default value: 10.
        start The ordinal number of the first entry that is returned. Valid values: 0 to 499. Default value: 0.
        query_filter Filter conditions using int_attr and string_attr. Supports logical operations >, >=, <, <=, and =
        """
        request = models.SearchImageByNameRequest()
        request.instance_name = self.instance_name
        request.product_id = product_id
        request.pic_name = pic_name
        request.num = num
        request.start = start
        request.category_id = category_id
        request.crop = crop
        request.crop = region
        request.filter = query_filter
        return self._do_request(self.client.search_image_by_name, request)

    def delete_image(self, product_id, pic_name):
        """
        Deletes one or more images
        @params Required
        product_id The unique id for each image
        pic_name The name of the image
        """
        request = models.DeleteImageRequest()
        request.instance_name = self.instance_name
        request.product_id = product_id
        request.pic_name = pic_name
        return self._do_request(self.client.delete_image, request)

    def update_image(self, product_id, pic_name, int_attr=None,
                     custom_content=None, str_attr=None):
        """
        Updates Image Information
        @params Required
        product_id The unique id for each image
        pic_name The name of the image
        @Params Optional
        custom_content The comment on the image e.g. description
        int_attr User id. To search for images specific to users
        string_attr Attributes of image. It can be used in image search
        """
        request = models.UpdateImageRequest()
        request.instance_name = self.instance_name
        request.product_id = product_id
        request.pic_name = pic_name
        request.int_attr = int_attr
        request.custom_content = custom_content
        request.str_attr = str_attr
        return self._do_request(self.client.update_image, request)

    def detail(self):
        """
        Get Instance Information
        """
        request = models.DetailRequest()
        request.instance_name = self.instance_name
        return self._do_request(self.client.detail, request)

    def dump_meta(self):
        """
        Created a task to export metadata
        """
        request = models.DumpMetaRequest()
        request.instance_name = self.instance_name
        return self._do_request(self.client.dump_meta, request)

    def dump_meta_list(self, req_id=None, page_number=None, page_size=None):
        """
        Queries the tasks that are used to export metadata
        """
        request = models.DumpMetaListRequest()
        request.instance_name = self.instance_name
        request.id = req_id
        request.page_size = page_size
        request.page_number = page_number
        return self._do_request(self.client.dump_meta_list, request)

    def batch_task(self, bucket_name, path, callback_address=None):
        """
        Creates a batch task for uses Alibaba Bucket(OSS)
        """
        request = models.IncreaseInstanceRequest()
        request.instance_name = self.instance_name
        request.bucket_name = bucket_name
        request.path = path
        request.callback_address = callback_address
        return self._do_request(self.client.increase_instance, request)

    def batch_task_list(self, bucket_name, path, req_id=None,
                        page_number=None, page_size=None):
        """
        Queries the tasks that are used to perform batch operations
        """
        request = models.IncreaseListRequest()
        request.instance_name = self.instance_name
        request.bucket_name = bucket_name
        request.path = path,
        request.id = req_id
        request.page_size = page_size
        request.page_number = page_number
        return self._do_request(self.client.increase_list, request)

    def _parse_response(self, response):
        #print(f"Response from {self.instance_name} {response.to_map()}")
        response_body = response.body.to_map()
        if response_body["Success"]:
            return response_body
        return None

    def _do_request(self, req_function, request, runtime_option=None):
        try:
            if runtime_option:
                response = req_function(request, runtime_option)
            else:
                response = req_function(request)
        except Exception as e:
            error_info = e.args[0]
            request_id = error_info["data"]["RequestId"]
            message = error_info["data"]["Message"]
            code = error_info["data"]["Code"]
            status_code = error_info["data"]["statusCode"]
            return status_code, {"Error": message}
        return 200, self._parse_response(response)


if __name__ == "__main__":
    alibaba = AlibabaService()
    resp = alibaba.detail()
    online_stat = "Offline"
    if resp:
        online_stat = "Online"
    output_str = f'''
    This is the Alibaba Image Search Instance Connector. The Instance is {online_stat}
    You can use the Image Similarity System
    '''
    print(output_str)