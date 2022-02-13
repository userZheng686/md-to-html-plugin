const randomNum = require("./utils");

const reg_mark = /^(.+?)\s/;
const reg_sharp = /^\#/;
const reg_crossbar = /^\-/;
const reg_number = /^\d+/;

function createTree(mdArr) {
  let _htmlPool = {};
  let _lastMark = "";
  let _key = 0;

  mdArr.forEach((mdFragment) => {
    const matched = mdFragment.match(reg_mark);

    if (matched) {
      const mark = matched[1];
      const input = matched["input"];

      if (reg_sharp.test(mark)) {
        const tag = `h${mark.length}`;
        const tagContent = input.replace(reg_mark, "");

        if (_lastMark === mark) {
          _htmlPool[`${tag}-${_key}`].tags = [
            ..._htmlPool[`${tag}-${_key}`].tags,
            `<${tag}>${tagContent}</${tag}>`,
          ];
        } else {
          _lastMark = mark;
          _key = randomNum();
          _htmlPool[`${tag}-${_key}`] = {
            type: "single",
            tags: [`<${tag}>${tagContent}</${tag}>`],
          };
        }
      }

      if (reg_crossbar.test(mark)) {
        const tagContent = input.replace(reg_mark, "");
        const tag = `li`;

        if (reg_crossbar.test(_lastMark)) {
          _htmlPool[`ul-${_key}`].tags = [
            ..._htmlPool[`ul-${_key}`].tags,
            `<${tag}>${tagContent}</${tag}>`,
          ];
        } else {
          _lastMark = mark;
          _key = randomNum();
          _htmlPool[`ul-${_key}`] = {
            type: "wrap",
            tags: [`<${tag}>${tagContent}</${tag}>`],
          };
        }
      }

      if (reg_number.test(mark)) {
        const tagContent = input.replace(reg_mark, "");
        const tag = "li";

        if (reg_number.test(_lastMark)) {
          _htmlPool[`ol-${_key}`].tags = [
            ..._htmlPool[`ol-${_key}`].tags,
            `<${tag}>${tagContent}</${tag}>`,
          ];
        } else {
          _lastMark = mark;
          _key = randomNum();
          _htmlPool[`ol-${_key}`] = {
            tags: [`<${tag}>${tagContent}</${tag}>`],
            type: "wrap",
          };
        }
        // console.log(tagContent)
      }
    }
  });

  return _htmlPool;
}

function compileHTML(_mdArr) {
  let _htmlPool = createTree(_mdArr);
  let _htmlStr = "";
  let item;

  for (let k in _htmlPool) {
    item = _htmlPool[k];

    if (item.type === "single") {
      item.tags.forEach((tag) => {
        tag = tag.replace('\r','')
        _htmlStr += tag;
      });
    } 
    else if (item.type === "wrap") {
      let _tag = k.split("-")[0];
      let _taglist = "";
      item.tags.forEach((tag) => {
        tag = tag.replace('\r','')
        _taglist += tag;
      });
      
      _htmlStr += `<${_tag}>${_taglist}</${_tag}>`;
    }
  }

  return _htmlStr
}

module.exports = compileHTML;
