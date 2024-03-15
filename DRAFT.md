# Draft handler


## 1. pixels.tips - Crawl items
```javascript
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
let tables = document.querySelectorAll("div[data-prefix]")
let item_arr = [...tables].map((table) => {
    let rows = table.querySelectorAll("table > tbody > tr")
    let items = [...rows].map((item) => {
        let tds = item.querySelectorAll("td")
        let dataset = [...tds].map((td) => {
            let hasSprite = td.querySelector("div[title].item-sprite")
            let hasIcon = td.querySelector("img")
            let itemKey = td.getAttribute("data-key")
            let itemValue: string | number = item.value
                .split(/[\s,\t,\n]+/)
                .join(' ')
                .trim();
            if (itemKey !== 'itemId') {
                itemValue = parseFloat((itemValue as string)?.replace(/^\D+/g, ''));
            }
            return {
                "key": itemKey,
                "value": td.textContent,
                "icon": hasSprite ? hasSprite.getAttribute("style").match(/\bhttps?:\/\/\S+/gi)?.[0].substring(0, hasSprite.getAttribute("style").match(/\bhttps?:\/\/\S+/gi)?.[0].length - 2)
     : hasIcon ? hasIcon.getAttribute("src") : null
            }
        })
        return dataset
    })
    return {
        "label": capitalizeFirstLetter(table.getAttribute("data-prefix").replaceAll("skills-database-", "")),
        "item": items
    }
})
console.log(item_arr)
```
