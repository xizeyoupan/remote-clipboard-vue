const ab2str = (ab) => {
    return new TextDecoder().decode(ab);
};

const insertStr2ab = (e, str) => {
    e.buffer = str2ab(str);
};

const str2ab = (str) => {
    return new TextEncoder().encode(str).buffer;
};

const ab2url = (ab, type) => {
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

        new_clip = gen_clip(buffer, contentType);
        return new_clip;
    }
};

const gen_clip = (ab, contentType, filename = '') => {
    let new_clip = {};
    new_clip.buffer = ab;
    new_clip.contentType = contentType ? contentType : 'application/octet-stream';
    new_clip.blocked = "released";
    new_clip.username = sessionStorage.getItem("username");
    new_clip.builtTime = new Date().getTime();
    new_clip.changeTime = new_clip.builtTime;
    new_clip.filename = filename;
    return new_clip;
}

export {
    ab2url,
    insertStr2ab,
    upload_text_or_img,
    ab2str,
    gen_clip,
}