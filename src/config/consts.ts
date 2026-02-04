import RNFS from 'react-native-fs'

export const GLOBALS = {
  timeValidJwtMin: 1,
  dir_path_img: `${RNFS.DocumentDirectoryPath}/images`,
  entity_type: {
    PER: 'PERSON', // para que vallan a la misma tabla PersonEntity
    PERSON: 'PersonEntity',
    ORGANIZATION: 'OrganizationEntities',
    OBJ: 'OBJECT',
    OBJECT: 'ObjectEntity',
    COMP: 'COMPLEMENTARY',
    COMPLEMENTARY: 'ComplementaryEntity'
  }
}
