import { UCloudUFile } from "../utils/ufile"

const upload_to_oss = (config, clip, successCallBack, errorCallBack, progressCallBack) => {
    const ufile = new UCloudUFile(config.ucloudBucketName, config.ucloudBucketUrl, config.ucloudpublicKey, config.ucloudPrivateKey, "", config.ucloudPrefix);
    const blob = new Blob([clip.buffer], { type: clip.contentType });
    const file = new File([blob], clip.fileName, { type: clip.contentType });
    const data = { file, fileRename: clip.uuid }
    ufile.uploadFile(data, successCallBack, errorCallBack, progressCallBack);
}

const download_from_oss = (config, clip, successCallBack, errorCallBack, progressCallBack) => {
    const ufile = new UCloudUFile(config.ucloudBucketName, config.ucloudBucketUrl, config.ucloudpublicKey, config.ucloudPrivateKey, "", config.ucloudPrefix);
    ufile.downloadFile(config.ucloudPrefix + '/' + clip.uuid, successCallBack, errorCallBack, progressCallBack);
}

const delete_from_oss = (config, clip, successCallBack, errorCallBack) => {
    const ufile = new UCloudUFile(config.ucloudBucketName, config.ucloudBucketUrl, config.ucloudpublicKey, config.ucloudPrivateKey, "", config.ucloudPrefix);
    ufile.deleteFile(config.ucloudPrefix + '/' + clip.uuid, successCallBack, errorCallBack);
}

const batch_delete_from_oss = (config, clipList, successCallBack, errorCallBack) => {
    const ufile = new UCloudUFile(config.ucloudBucketName, config.ucloudBucketUrl, config.ucloudpublicKey, config.ucloudPrivateKey, "", config.ucloudPrefix);
    const fileList = clipList.map((i) => {
        return config.ucloudPrefix + '/' + i.uuid;
    });
    ufile.batchDelete(fileList, successCallBack, errorCallBack);
}

export {
    upload_to_oss,
    download_from_oss,
    delete_from_oss,
    batch_delete_from_oss
}