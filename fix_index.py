with open('index.html', 'r') as f:
    content = f.read()

og_tags = """    <meta property="og:title" content="PostNaMão | Suas Artes Imobiliárias Prontas em Segundos" />
    <meta property="og:description" content="A primeira ferramenta de marketing exclusiva para corretores." />
    <meta property="og:image" content="/icon.svg" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="PostNaMão | Suas Artes Imobiliárias Prontas em Segundos" />
    <meta name="twitter:description" content="A primeira ferramenta de marketing exclusiva para corretores." />
    <meta name="twitter:image" content="/icon.svg" />
  </head>"""

content = content.replace("  </head>", og_tags)

with open('index.html', 'w') as f:
    f.write(content)
