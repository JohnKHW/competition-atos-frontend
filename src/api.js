import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default axios.create({
  baseURL: "https://atos-api.herokuapp.com/",
  headers: {
    //"Content-Type": "application/json; multipart/form-data",
    "Content-Type":
      "multipart/form-data boundary=----WebKitFormBoundaryOqFKeb2O2V9XWGMM",
  },
});
