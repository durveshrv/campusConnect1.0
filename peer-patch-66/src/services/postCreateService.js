import http from "./httpService.js";
import  { api } from "./config.js";

export function createpost(postbody) {
  console.log(api.postsEndPoint + "create");
  return http.post(api.postsEndPoint + 'create', {
    title: postbody.title,
    description: postbody.description,
    tags: postbody.tags
  });
}