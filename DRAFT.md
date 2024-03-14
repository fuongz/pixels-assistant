# Draft handler


## 1. PixelsData.xyz - Crawl items
```javascript
[...document.querySelectorAll("#tablepress-cooking-stove > tbody > tr")].map((e) => {
    var tds = e.querySelectorAll("td")

    var icon = tds[0].querySelector("img").getAttribute("src")
    var name = tds[1].textContent
    var level_required = tds[2].textContent
    var repcipe = tds[3].textContent
    // var price = tds[4].textContent
    var time = tds[4].textContent
    var xp_gain = tds[5].textContent
    var energy_use = tds[6].textContent
    // var return_value = tds[8].textContent
    var eat_for_energy = tds[7].textContent
    var notes = tds[8].textContent
    
    return {
        icon,
        name,
        level_required,
        repcipe,
        // price,
        time,
        xp_gain,
        energy_use,
        // return_value,
        // eat_for_energy,
        notes,
    }
})
```
