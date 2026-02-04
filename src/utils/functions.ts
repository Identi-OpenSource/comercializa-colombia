/* eslint-disable camelcase */
export function replaceValuesKeysKeys(
  obj1: { [key: string]: any },
  obj2: { [key: string]: any }
): { [key: string]: any } {
  const nuevoObjeto: { [key: string]: any } = {}

  // Recorrer cada clave en el primer objeto
  for (const clave in obj1) {
    const valor = obj1[clave]

    // Verificar si el valor tiene el formato de plantilla "{{ key }}"
    const match = valor.match(/{{\s*(\w+)\s*}}/)

    if (match) {
      // Extraer el nombre de la clave entre "{{" y "}}"
      const clave_a_buscar = match[1]

      // Verificar si esa clave existe en el segundo objeto
      if (clave_a_buscar in obj2) {
        // Reemplazar el valor con el valor del segundo objeto
        nuevoObjeto[clave] = obj2[clave_a_buscar]
      } else {
        // Mantener el valor original si no se encuentra en obj2
        nuevoObjeto[clave] = valor
      }
    } else {
      // Si el valor no es una plantilla, copiar tal cual
      nuevoObjeto[clave] = valor
    }
  }

  return nuevoObjeto
}
