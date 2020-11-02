<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Ter cuidado que o encoding deste doc n�o � UTF-8 -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs"
    version="2.0">
    
    <!-- Template HTML -->  
    <xsl:template match="/">
        <xsl:result-document href="my_site/arq_index.html">
            <head>
                <title>Arqueoss�tios NW Portugal</title>
            </head>
            <body>
                <h2>Arqueoss�tios NW Portugal</h2>
                <table border="1" width="100%">
                    <tr>
                        <td width="30%" valign="top">
                            <h3>�ndice de Arqueoss�tios</h3>
                            <ol>
                                <xsl:apply-templates select="//ARQELEM" mode="indice">
                                    <xsl:sort select="IDENTI"/>
                                </xsl:apply-templates>
                            </ol>
                        </td>
                        <td>
                            <!--xsl:apply-templates/-->
                        </td>
                    </tr>
                </table>
            </body>
        </xsl:result-document>
    </xsl:template>
    
    <!-- Template �ndice -->
    <xsl:template match="ARQELEM" mode="indice">
        <li>
            <a name="i{generate-id()}"/>
            <a href="{generate-id()}.html">
                <xsl:value-of select="IDENTI"/>
            </a>
        </li>
    </xsl:template>  
    
    <!-- Template ARQELEMS -->
    
    
</xsl:stylesheet>