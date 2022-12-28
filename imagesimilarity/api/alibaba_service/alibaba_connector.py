import hmac
import random
import base64
import hashlib
import requests
import config as c
import datetime as dt


def _generate_current_datetime_format():
    """
    Generates datetime from current time GMT
    """
    current_time = dt.datetime.now(dt.timezone.utc)
    return current_time.strftime("%a %d %b %Y %H:%M:%S GMT")


def _generate_b64_encoded_md5_128_hash(hashable):
    """
    Generates base64 encoded after calculating MD5 128-bit hash with the key
    """
    return base64.b64encode(hashlib.md5(hashable.encode("utf-8")).digest()).decode('utf-8')


def _generate_b64_hmac_sha1_hash(key, message):
    """
    Generates base64 encoded after calculating HMAC-SHA1 hash with the key
    """
    key, message = bytes(key, 'utf-8'), bytes(message, 'utf-8')
    hmac_digest = hmac.new(key, message, hashlib.sha1).digest()
    b64_hash = base64.b64encode(hmac_digest)
    return str(b64_hash, 'utf-8')


class AlibabaServiceAPI:
    def __init__(self, base_url=c.IS_BASE_URL, access_key=c.IS_ACCESS_KEY, secret_key=c.IS_SECRET_KEY,
                 region=c.IS_REGION, instance_name=c.IS_INSTANCE_NAME, instance_id=c.IS_INSTANCE_ID):
        self.base_url = base_url
        self.access_key = access_key
        self.secret_key = secret_key
        self.region = region
        self.instance_name = instance_name
        self.instance_id = instance_id
        result = '%s' % int(random.random() * 100000000000000)
        self.boundary = result.zfill(14)

    def __repr__(self):
        return f"base_url: {self.base_url}\naccess_key: {self.access_key}\nsecret_key: {self.secret_key}\nregion " \
               f"{self.region}\nInstance Name {self.instance_name}\nInstance ID {self.instance_id}"

    def _generate_headers(self, signature, b64_md5_hash, request_time, nonce):
        """
        Generates headers for ALibaba
        Ref: https://www.alibabacloud.com/help/en/image-search/latest/common-parameters
                    "content-type": "application/x-www-form-urlencoded;charset=utf-8",

        """
        return {
            "authorization": "acs " + self.access_key + ":" + signature,
            "content-type": f"application/x-www-form-urlencoded;charset=utf-8",
            "content-md5": b64_md5_hash,
            "date": request_time,
            "accept": "application/json",
            "x-acs-signature-nonce": nonce,
            "x-acs-signature-method": "HMAC-SHA1",
            "x-acs-version": "2019-03-25"
        }

    def _generate_header_to_sign(self, b63_md5_hash, request_datetime, nonce, endpoint):
        """
        Generates header to be signed for Authentication to Alibaba Cloud Services
        Ref: https://www.alibabacloud.com/help/en/image-search/latest/digital-signature
                       f"application/x-www-form-urlencoded;charset=utf-8\n" \
        """
        return f"POST\n" \
               f"application/json\n" \
               f"{b63_md5_hash}\n" \
               f"application/x-www-form-urlencoded;charset=utf-8\n" \
               f"{request_datetime}\n" \
               f"x-acs-signature-method:HMAC-SHA1\n" \
               f"x-acs-signature-nonce:{nonce}\n" \
               f"x-acs-version:2019-03-25\n" \
               f"/v2/{endpoint}"

    def detail(self):
        endpoint = "image/detail"
        request_time = _generate_current_datetime_format()
        nonce = str(random.randint(111111111111111111, 999999999999999999))
        data = f"InstanceName={self.instance_name}"
        b64_md5_post_data = _generate_b64_encoded_md5_128_hash(data)
        header_to_sign = self._generate_header_to_sign(b64_md5_post_data, request_time, nonce, endpoint)
        signature = _generate_b64_hmac_sha1_hash(self.secret_key, header_to_sign)
        headers = self._generate_headers(signature, b64_md5_post_data, request_time, nonce)
        url = self.base_url+endpoint
        print(url)
        resp = requests.post(url, headers=headers, data=data.encode("utf-8"))
        print(resp.json())

    def add_image(self):
        endpoint = "image/add"
        request_time = _generate_current_datetime_format()
        nonce = str(random.randint(111111111111111111, 999999999999999999))

        with open("../imagesimilarity/daata/2.jpg", "rb") as f:
            im_data = base64.b64encode(f.read())
        data = f"InstanceName={self.instance_name}&ProductId=random0001&PicName=random0012&PicContent={im_data}"
        b64_md5_post_data = _generate_b64_encoded_md5_128_hash(data)
        header_to_sign = self._generate_header_to_sign(b64_md5_post_data, request_time, nonce, endpoint)
        signature = _generate_b64_hmac_sha1_hash(self.secret_key, header_to_sign)
        headers = self._generate_headers(signature, b64_md5_post_data, request_time, nonce)
        url = self.base_url + endpoint
        print(url)
        resp = requests.post(url, headers=headers, data=data.encode("utf-8"))
        print(resp.json())


if __name__ == "__main__":
    online_stat = "Online"
    output_str = f'''
    This is the Alibaba Image Search Instance Connector. The Instance is {online_stat}
    You can use the Image Similarity System
    '''
    alibaba = AlibabaServiceAPI()
    #alibaba.detail()
    alibaba.add_image()




