# Fonts — attribution & licensing

All four brand families are licensed under the **SIL Open Font License, Version 1.1**
(full text in [`OFL.txt`](./OFL.txt)). The OFL permits bundling and self-hosting these
woff2 files inside this package and the apps that consume it.

Only the **latin** subset of each face is bundled (these apps are English / AU),
which is why each file is small (14–23 KB).

| Family            | Files                              | Copyright                                                            | Reserved Font Name |
|-------------------|------------------------------------|---------------------------------------------------------------------|--------------------|
| Bebas Neue        | `bebas-neue-400.woff2`             | Copyright © 2010 Dharma Type / Ryoichi Tsunekawa                    | Bebas Neue         |
| Barlow            | `barlow-{400,500,600,700}.woff2`   | Copyright © 2017 The Barlow Project Authors (Jeremy Tribby)         | —                  |
| Barlow Condensed  | `barlow-condensed-{300,400,600}.woff2` | Copyright © 2017 The Barlow Project Authors (Jeremy Tribby)     | —                  |
| Share Tech Mono   | `share-tech-mono-400.woff2`        | Copyright © 2012 The Share Tech Mono Project Authors (Carrois Apostrophe) | —        |

The files were retrieved from Google Fonts via [`../scripts/fetch-fonts.py`](../scripts/fetch-fonts.py),
which can be re-run to refresh them.

Under the OFL: these fonts may be used, studied, modified and redistributed freely,
**but may not be sold on their own**, and any reserved font name (e.g. "Bebas Neue")
may not be used on a *modified* version.
