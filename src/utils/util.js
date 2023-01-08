import UUID from "uuidjs";
import mine from "mime"
import Text from "../components/clips/Text.vue"
import Img from "../components/clips/Img.vue"
import Default from "../components/clips/Default.vue"

const ab2str = (ab) => {
    return new TextDecoder().decode(ab);
};


const str2ab = (str) => {
    return new TextEncoder().encode(str).buffer;
};

const ab2url = function (ab, type) {
    if (!ab) return ``;
    const blob = new Blob([ab], { type: type });
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
        let fileName;
        for (const type of clipboardItem.types) {
            if (type.includes("image")) {
                is_img = true;
                buffer = await (await clipboardItem.getType(type)).arrayBuffer();
                contentType = type;
                fileName = "imgFromClipboard." + mine.getExtension(contentType);
            }
        }

        if (!is_img && clipboardItem.types.includes("text/plain")) {
            contentType = "text/plain";
            let clip_text = await (await clipboardItem.getType("text/plain")).text();
            buffer = str2ab(clip_text);
            fileName = "textFromClipboard.txt";
        }

        new_clip = gen_clip(buffer, contentType, fileName);
        return new_clip;
    }
};

const gen_clip = (ab, contentType, fileName = '') => {
    let new_clip = {};
    new_clip.uuid = UUID.generate();
    new_clip.buffer = ab;
    new_clip.size = ab.byteLength;
    new_clip.contentType = contentType ? contentType : 'application/octet-stream';
    new_clip.status = 1;
    new_clip.createTime = new Date();
    new_clip.modifyTime = new_clip.createTime;
    new_clip.fileName = fileName;
    new_clip.progress = { status: '', percentage: 0 }
    return new_clip;
}


const isEmptyObject = function (obj) {
    let name;
    for (name in obj) {
        return false;
    }
    return true;
}

const contentType2ClipComponents = (clip) => {
    const map = {
        "text/html": Text,
        "text/plain": Text,
        "application/json": Text,
        'image/jpeg': Img,
        'image/png': Img
    };
    if (Object.keys(map).includes(clip.contentType)) return map[clip.contentType];
    return Default;

}

export {
    isEmptyObject,
    ab2url,
    upload_text_or_img,
    ab2str,
    gen_clip,
    str2ab,
    contentType2ClipComponents
}