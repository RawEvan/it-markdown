# Widget Gallery

All interactive widgets available in it-markdown.

## Buttons

Basic button with click handler:

[Click me](!button:onclick='console.log("Clicked!")')

Button with custom label and ID:

[Submit Form](!button:id=submit-btn,onclick='handleSubmit()')

## Sliders

Range slider with min/max:

[Volume](!slider:min=0,max=100,value=50)

Slider with step:

[Brightness](!slider:min=0,max=1,step=0.1,value=0.7)

## Radio Groups

Single choice:

[Choose one](!radio:name=theme,options='Light,Dark,System')

## Checkboxes

Multiple selection:

[Features](!checkbox:name=features,options='Notifications,Auto-save,Spellcheck')

## Tabs

Organize content with tabbed sections:

[!tab:Overview]

This is the overview tab content. Markdown works here too!

- Lists
- Nested
- Items

[!tab:Code Examples]

```javascript
const greeting = "Hello, World!";
console.log(greeting);
```

[!tab:Notes]

> Important notes go here.

## Collapse

Expandable sections:

[!collapse:Click to reveal]

Hidden content that appears when you click.

Perfect for spoilers, spoilers, spoilers!

## Color Picker

Color selection:

[Theme Color](!color:value=#3b82f6)

---

## Combined Example

Here's a form-like section with multiple widgets:

### Settings

[Theme](!radio:name=theme2,options='Light,Dark')

[Font Size](!slider:min=12,max=24,value=16)

[Notifications [Enable notifications](!checkbox:name=notifs)

[Save Settings](!button:onclick='saveSettings()')
