# Social-Relationships
* Next Birthday
Trick: The `parseDate()` function only takes `YYYY-MM-DD` format, which is okay, but whenever the month or date has only a single integer (e.g. January 15th, December 1st, or something like Feburary 2nd), it will fail to meet that format, hence an `if` statement is needed to ensure that this meets the length requirement.
```
if(
		dateBetween(
			parseDate(
        format(
            year(now()) + "-" 
            + if(format(month(prop("Birthday"))).length()==1, "0"+format(month(prop("Birthday"))), format(month(prop("Birthday")))) + "-" 
            + if(format(date(prop("Birthday"))).length()==1, "0"+format(date(prop("Birthday"))), format(date(prop("Birthday"))))
    )
), 
			now(), 
			"days") < 0,
        parseDate(
        format(
            year(now())+1 + "-" 
            + if(format(month(prop("Birthday"))).length()==1, "0"+format(month(prop("Birthday"))), format(month(prop("Birthday")))) + "-" 
            + if(format(date(prop("Birthday"))).length()==1, "0"+format(date(prop("Birthday"))), format(date(prop("Birthday"))))
    )
),
		parseDate(
        format(
            year(now()) + "-" 
            + if(format(month(prop("Birthday"))).length()==1, "0"+format(month(prop("Birthday"))), format(month(prop("Birthday")))) + "-" 
            + if(format(date(prop("Birthday"))).length()==1, "0"+format(date(prop("Birthday"))), format(date(prop("Birthday"))))
    )
)
)
```

# Progress Bar
```
slice("● ● ● ● ● ● ● ● ● ●".split(), 0, round(prop("ProgressPercent") * 10)).join("") + slice("○ ○ ○ ○ ○ ○ ○ ○ ○ ○".split(), 0, round((1 - prop("ProgressPercent")) * 10)).join("") + " " + if(prop("Completed") == 0, "0", format(round(prop("ProgressPercent") * 100))) + "%"
```

```
slice("● ● ● ● ● ● ● ● ● ●".split(), 0, 2).join("")
```