const UUID = require("uuidjs");

const addBufferForClip = async (clip, $http) => {

    const response = await $http({
        method: "POST",
        url: "/file/download",
        data: clip,
        responseType: `arraybuffer`
    });
    clip.buffer = response.data;

    return clip;
}

const getTextFormClip = async (clip, $http) => {
    if (!clip.buffer) clip = await addBufferForClip(clip, $http);
    console.log(578674564645)
    return ab2str(clip.buffer);
}

const ab2str = (ab) => {
    // if (!ab) return `loading`
    return new TextDecoder().decode(ab);
};

const insertStr2ab = (e, str) => {
    e.buffer = str2ab(str);
    e.modifyTime = new Date();
};

const str2ab = (str) => {
    return new TextEncoder().encode(str).buffer;
};

const ab2url = function (ab, type) {
    if (!ab) return ``;
    const blob = new Blob([ab], {type: type});
    return URL.createObjectURL(blob);
};

const upload_text_or_img = async (callback) => {
    let clipboardItems, new_clip, buffer, contentType;

    try {
        clipboardItems = await navigator.clipboard.read();
    } catch (e) {
        callback();
        return;
    }

    for (const clipboardItem of clipboardItems) {
        let is_img = false;

        for (const type of clipboardItem.types) {
            if (type.includes("image")) {
                is_img = true;
                buffer = await (await clipboardItem.getType(type)).arrayBuffer();
                contentType = type;
            }
        }

        if (!is_img && clipboardItem.types.includes("text/plain")) {
            contentType = "text/plain";
            let clip_text = await (await clipboardItem.getType("text/plain")).text();
            buffer = str2ab(clip_text);
        }

        new_clip = gen_clip(buffer, contentType, `imgByUpload`);
        return new_clip;
    }
};

const gen_clip = (ab, contentType, fileName = '') => {
    let new_clip = {};
    new_clip.uuid = UUID.generate();
    new_clip.buffer = ab;
    new_clip.connectionId = parseInt(sessionStorage.getItem("connectionId"));
    new_clip.contentType = contentType ? contentType : 'application/octet-stream';
    new_clip.blocked = "released";
    new_clip.username = sessionStorage.getItem("username");
    new_clip.modifyTime = new Date();
    new_clip.clipMode = `CREATED`;
    new_clip.fileName = fileName;
    return new_clip;
}
const isEmptyObject = function (obj) {
    let name;
    for (name in obj) {
        return false;
    }
    return true;
}

export {
    isEmptyObject,
    ab2url,
    insertStr2ab,
    upload_text_or_img,
    ab2str,
    gen_clip,
    str2ab,
    getTextFormClip
}