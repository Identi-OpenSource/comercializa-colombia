<p align="center">
  <a href="https://www.micacao.org/">
    <img src="https://static.wixstatic.com/media/ebdd7b_b5544ac1b9d542cb8dfd9ddd84a0609f~mv2.png/v1/fill/w_195,h_61,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/4.png" alt="Descripción de la imagen" width="300" style="background-color: white; border-radius: 10px; padding: 10px;">
  </a>
</p>

<p align="center">
  El proyecto <a href="https://www.micacao.org/" style="text-decoration: none;">MiCacao</a> busca desarrollar una herramienta de trazabilidad para productores y comercializadores de cacao en Perú y Colombia, garantizando el cumplimiento de la normativa europea sobre productos libres de deforestación.
</p>

# MiCacao Comercializa App

**MiCacao Comercializa** es una innovadora aplicación en React Native, diseñada para que los agentes de campo puedan capturar los datos de los productores de cacao en Colombia y Perú que no tienen la posibilidad de usar nuestra app principal <a href="https://play.google.com/store/search?q=micacao&c=apps&hl=es_419&pli=1">**MiCacao Productores**</a>, La aplicación permite gestionar de manera eficiente todos los aspectos relacionados con la producción de cacao.

Aunque **MiCacao Comercializa** está diseñada en React Native, actualmente **solo es compatible con sistemas Android** en sus versiones API level 29 y superiores. Esto asegura que la aplicación funcione de manera óptima en dispositivos Android modernos, garantizando a los usuarios una experiencia estable y eficiente mientras gestionan la información y procesos de producción.

<p align="center">
  <a href="https://play.google.com/store/apps/details?id=digital.identi.micacao.comercializa&hl=es_419">
    DESCARGAR EN GOOGLE PLAY STORE COLOMBIA Y PERÚ
  </a>
</p>

## Funcionalidades Principales

- **Registro de Productores**: Los agentes pueden registrar productores de cacao, que no tenga la posibilidad de usar nuestra app principal <a href="https://play.google.com/store/search?q=micacao&c=apps&hl=es_419&pli=1">**MiCacao Productores**</a>
- **Registro de Parcelas**: Los agentes pueden registrar las parcelas de cultivo, almacenando información clave sobre la localización y características de cada una.
- **Registro de Compras**: Los agentes pueden registrar compras de cacao a los productores.
- **Operación Offline y Online**: MiCacao Comercializa puede funcionar tanto en modo offline como online, garantizando que los agentes puedan sincronizar sus datos con la incluso sin conexión a internet.

## Arquitectura

MiCacao Comercializa está diseñada para funcionar con un backend de la nube, que suministra todos los datos necesarios para la gestión de la información. Esto incluye desde la gestión de usuario hasta la información solicitada en cada uno de los formularios, por lo que podemos decir que es una app de recolección de datos.

## Requerimientos

- Java Development Kit (JDK) versión 17+
- Node.js versión 20+
- React Native CLI
- Archivo .env (solicítalo)

#### Compatibilidad

**MiCacao Comercializa** está diseñada para funcionar en dispositivos Android con API level 29 y superiores.

## Instalación

1. Asegúrate de tener React Native instalado en tu sistema. Si aún no lo tienes, sigue las instrucciones en [Instalación de React Native](https://reactnative.dev/docs/environment-setup).

2. Clonar este repositorio:

```
git clone https://github.com/Identi-OpenSource/micacao-comercializa.git
```

3. Instalación de los paquetes de npm:

```
npm install --legacy-peer-deps
```

4. Iniciación del proyecto

```
npm start -- --reset-cache
```

## Contribución

Estamos encantados de recibir contribuciones de la comunidad para mejorar **MiCacao**. Si estás interesado en contribuir, aquí te mostramos algunas maneras en las que puedes hacerlo:

- **Sugerir una característica**: Si tienes una idea para una nueva funcionalidad que podría mejorar la aplicación, abre un issue en el repositorio para discutir tu sugerencia. Nos encantaría escuchar tus ideas y colaborar en su implementación.

      Para contribuir, sigue estos pasos:

      1. Haz un "fork" de este repositorio.
      2. Crea una nueva rama para tu función o corrección (`git checkout -b feature/nueva-funcion`).
      3. Realiza tus cambios y realiza commits descriptivos (`git commit -m 'Agrega nueva función'`).
      4. Envía tus cambios al repositorio forkeado (`git push origin feature/nueva-funcion`).
      5. Abre un Pull Request en este repositorio desde tu rama forkeada.

      Revisaremos tu contribución lo antes posible
      ¡Esperamos tus sugerencias y mejoras!

- **Implementación de correcciones de errores y mejoras**: Si deseas corregir un error o implementar una mejora, primero revisa los issues abiertos para ver si alguien más ya está trabajando en ello. Si no es así, crea un issue para anunciar tu intención de trabajar en la corrección o mejora y luego envía un pull request cuando hayas terminado, para contribuir a la mejora del proyecto sigue los pasos del punto anterior.

- **Informar errores**: Si encuentras un error o problema en la aplicación, por favor, repórtalo a través del [sistema de issues](https://github.com/Identi-OpenSource/micacao-comercializa/issues). Asegúrate de proporcionar detalles sobre el problema, cómo reproducirlo y cualquier información adicional que pueda ser útil para corregirlo.

- **Respondiendo a los problemas**: Ayuda a la comunidad respondiendo a los problemas abiertos en el repositorio. Si tienes experiencia en la solución de problemas específicos, tus sugerencias y soluciones serán muy apreciadas.

¡Gracias por tu interés en contribuir a **MiCacao Comercializa**! Tu ayuda es invaluable para mejorar la herramienta y apoyar a los productores de cacao en Colombia y Perú.

## Contribuyentes

- Carlos Camilo Madera Sepúlveda: carlosmadera@soygenial.co
- Juan Pablo Diaz Puyo: gerencia@tecnomusic.com.co

## Licencia

Este proyecto está licenciado bajo la Licencia Apache-2.0. Consulta el archivo [LICENSE](./LICENSE) para obtener detalles completos.

## Aviso de Licencia MIT

El software está proporcionado "tal cual", sin ninguna garantía de ningún tipo. Los autores no son responsables de ningún daño que pueda surgir del uso del software.
