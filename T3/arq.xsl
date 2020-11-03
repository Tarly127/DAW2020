<?xml version="1.0" encoding="iso-8859-1"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="2.0">
    
    <!-- Template HTML -->  
    <xsl:template match="/">
        <xsl:result-document href="my_site/index.html">
            <head>
                <title>Arqueossítios NW Portugal</title>
            </head>
            <body>
                <h2>Arqueossítios NW Portugal</h2>
                <table border="1" width="100%">
                    <tr>
                        <td width="30%" valign="top">
                            <h3>Índice de Arqueossítios</h3>
                            <ol>
                                <xsl:apply-templates select="//ARQELEM" mode="indice">
                                    <xsl:sort select="IDENTI"/>
                                </xsl:apply-templates>
                            </ol>
                        </td>
                        <td>
                            <xsl:apply-templates/>
                        </td>
                    </tr>
                </table>
            </body>
        </xsl:result-document>
    </xsl:template>
    
    <!-- Template Índice -->
    <xsl:template match="ARQELEM" mode="indice">
        <li>
            <a name="i{generate-id()}"/>
            <a href="{generate-id()}.html">
                <xsl:value-of select="IDENTI"/>
            </a>
        </li>
    </xsl:template>  
    
    <!-- Template ARQELEMS -->
    <xsl:template match="ARQELEM">
        <xsl:result-document href="my_site/{generate-id()}.html">
            <html>
                <head>
                    <title>
                        <xsl:value-of select="IDENTI"/>
                    </title>
                </head>
                <body>
                    <!-- Adicionar as cenas aqui -->
                    <xsl:apply-templates/>
                    <address>
                        [<a href="index.html#i{generate-id()}">Voltar à Home</a>]
                    </address> 
                </body>
            </html>
        </xsl:result-document>
    </xsl:template>
    
    
    <!-- Temlpates dos items do ARQELEMS -->
    <xsl:template match="IMAGEM">
        <!-- Problema aqui -->
        <xsl:variable name="source" select="@NOME"/>
        <img src="$source" alt="Image not available"/>
    </xsl:template>
    
    <xsl:template match="IDENTI">
        <h2 style="margin-bottom:50px"><b><xsl:value-of select="."/></b></h2>
    </xsl:template>
    
    <xsl:template match="DESCRI">
        <p><b>Descrição: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="LUGAR">
        <p><b>Lugar: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="FREGUE">
        <p><b>Freguesia: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="ACESSO">
        <p><b>Acesso: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="QUADRO">
        <p><b>Quadro: </b><xsl:apply-templates/></p>
    </xsl:template>
   
    <xsl:template match="TRAARQ">
        <p><b>Trabalhos arqueológicos: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="DESARQ">
        <p><b>Descrição da Exploração Arqueológica: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="INTERP">
        <p><b>Interpretação: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="INTERE">
        <p><b>Interesse: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="BIBLIO">
        <p><span style="color:grey"><xsl:apply-templates/></span></p>
    </xsl:template>
    
    <xsl:template match="CONCEL">
        <p><b>Concelho: </b><xsl:value-of select="."/></p>
    </xsl:template>
    
    <xsl:template match="CODADM">
        <p><b>Código Administrativo: </b><xsl:value-of select="."/></p>
    </xsl:template>
    
    <xsl:template match="LATITU">
        <p><b>Latitude: </b><xsl:value-of select="."/></p>
    </xsl:template>
    
    <xsl:template match="LONGIT">
        <p><b>Longitude: </b><xsl:value-of select="."/></p>
    </xsl:template>
    
    <xsl:template match="ALTITU">
        <p><b>Altitude: </b><xsl:value-of select="."/></p>
    </xsl:template>
    
    <xsl:template match="DEPOSI">
        <p><b>Depositado em: </b><xsl:value-of select="."/></p>
    </xsl:template>
    
    <xsl:template match="CRONO">
        <p><b>Época: </b><xsl:value-of select="."/></p>
    </xsl:template>
    
    <xsl:template match="AUTOR">
        <p><b>Autor: </b><span style="color:blue;"><xsl:value-of select="."/></span></p>
    </xsl:template>
    
    <xsl:template match="LIGA">
        <span style="color:red;">
            <xsl:value-of select="."/>
        </span>
    </xsl:template>
</xsl:stylesheet>