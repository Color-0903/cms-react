export enum ActionUser {
  CREATE = 'create',
  EDIT = 'edit',
  READ = 'read',
  DELETE = 'delete',
  LOCK = 'lock',
}

export enum USER_TYPE {
  Admin = 'administrator',
  Trainer = 'trainer',
}
export enum PERMISSIONS {
  Authenticated = 'Authenticated',
  SuperAdmin = 'SuperAdmin',
  // roles
  CreateRole = 'CreateRole',
  ReadRole = 'ReadRole',
  UpdateRole = 'UpdateRole',
  DeleteRole = 'DeleteRole',
  // news
  CreateNews = 'CreateNews',
  ReadNews = 'ReadNews',
  UpdateNews = 'UpdateNews',
  DeleteNews = 'DeleteNews',
  // help
  CreateHelp = 'CreateHelp',
  ReadHelp = 'ReadHelp',
  UpdateHelp = 'UpdateHelp',
  DeleteHelp = 'DeleteHelp',
  // recruit
  CreateRecruit = 'CreateRecruit',
  ReadRecruit = 'ReadRecruit',
  UpdateRecruit = 'UpdateRecruit',
  DeleteRecruit = 'DeleteRecruit',
  // survey
  CreateSurvey = 'CreateSurvey',
  ReadSurvey = 'ReadSurvey',
  UpdateSurvey = 'UpdateSurvey',
  DeleteSurvey = 'DeleteSurvey',
  // user
  CreateCustomer = 'CreateCustomer',
  ReadCustomer = 'ReadCustomer',
  UpdateCustomer = 'UpdateCustomer',
  DeleteCustomer = 'DeleteCustomer',
  // trainer
  CreateTrainer = 'CreateTrainer',
  ReadTrainer = 'ReadTrainer',
  UpdateTrainer = 'UpdateTrainer',
  DeleteTrainer = 'DeleteTrainer',
  // admin
  CreateAdmin = 'CreateAdmin',
  ReadAdmin = 'ReadAdmin',
  UpdateAdmin = 'UpdateAdmin',
  DeleteAdmin = 'DeleteAdmin',
}

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
}
export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
