import axios from "axios";
import { Form } from "semantic-ui-react";
import  baseUrl from '/utils/baseUrl'
const uploadPic = async (media) => {
  try {
    const formData = new FormData();
    formData.append('image', media);

    const response = await axios.post(process.env.baseUrl+'/uploadImage', formData, {
      headers : {
        'Content-Type': 'multipart/form-data', // 根据需要添加其他标头
      }
    })

    return process.env.baseUrl+response.data.logoPath;
  } catch (error) {
    return;
  }
};

export default uploadPic;
