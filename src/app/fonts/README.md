# Fonts

Both fonts are self-hosted through `next/font/local` (`font-display: swap`) under the SIL Open Font License.

## Heebo (body)

Variable font (weights 100 to 900), vendored from the official Google Fonts repository; license in `OFL.txt`.

Source: https://raw.githubusercontent.com/google/fonts/main/ofl/heebo/Heebo%5Bwght%5D.ttf

Original TTF SHA-256: `18f930b583fa8fe6b40b2f8263b7ac6afbac07adc91a12467874e7467d3ace30`

`Heebo-Variable.woff2` is a lossless WOFF2 re-encoding of that TTF (same 591 glyphs and weight axis), made with fontTools.

SHA-256: `a5b20efb6e198fe960ded3e25c96f7eabf8ea2c61999178c8b5a91f1d5403098`

## Rubik (headings)

Variable font from the official Google Fonts repository; license in `OFL-Rubik.txt`.

Source: https://raw.githubusercontent.com/google/fonts/main/ofl/rubik/Rubik%5Bwght%5D.ttf

Original TTF SHA-256: `1b3a7437ba2af80e465e773ed60c5036d1ba6ace492d89046dbcf18fb31e4e88`

`Rubik-Variable.woff2` was reduced with fontTools: weight axis limited to 500–800 (`varLib.instancer wght=500:800`) and subset to Basic Latin, Latin-1, Hebrew (U+0590–05FF, U+FB1D–FB4F) and common punctuation and currency (including ₪), keeping all OpenType layout features.

SHA-256: `b100b07cdd500be8f65de706da636e8a0784af13b7c11c830317c8ccd886dc95`
