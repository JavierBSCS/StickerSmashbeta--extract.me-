const isEmpty = (value: string) => {
  if (value == "") return "field required";
  return "";
};

const checkEmpty = (
  index: string,
  error: any,
  value: string
) => {
  if (isEmpty(value)) {
    error[index] = isEmpty(value);
    return true;
  }
  return false;
};

const isEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const check = emailRegex.test(value);
  if (!check) return "invalid email";
  return "";
};

function isMin(value: string, len: number = 8) {
  if (value.length < len) return `min of ${len} char`;
  return "";
}

function isLength(
  index: string,
  error: any,
  value: string[],
  len: number = 3
) {

  if (value.length <= len) {
    error[index] = `re-check input`;
    return true;
  }
  return false;
}

interface SUser {
  f_name: string;
  l_name: string;
  email: string;
  phone: string;
  password: string;
}

interface LUser {
  email: string;
  password: string;
}

interface Other {
  cook: string;
  prep: string;
  level: string;
  total: string;
  yield: string;
}

interface Content {
  nutritions: string[];
  ingredients: string[];
  directions: string[];
}

interface CreateError {
  title: string;
  category: string;
  cook: string;
  prep: string;
  level: string;
  total: string;
  yield: string;
}

const signup_validator = (user: SUser) => {
  let err: SUser = {
    f_name: "",
    l_name: "",
    email: "",
    phone: "",
    password: "",
  };
  let status:boolean = false;

  status = checkEmpty("f_name", err, user.f_name);
  status = checkEmpty("l_name", err, user.l_name);

  if (isEmail(user.email)) {
    err.email = isEmail(user.email);
    status = true;
  }
  status = checkEmpty("phone", err, user.phone);

  if (isMin(user.password)) {
    err.password = isMin(user.password);
    status = true;
  }
  if (isMin(user.phone)) {
    err.phone = isMin(user.phone, 11);
    status = true;
  }
  return { status, err };
};

const login_validator = (user: LUser) => {
  let err: LUser = { email: "", password: "" };
  let status = false;

  if (isEmail(user.email)) {
    err.email = isEmail(user.email);
    status = true;
  }
  if (isMin(user.password)) {
    err.password = isMin(user.password);
    status = true;
  }
  return { status, err };
};

const create_validator = (
  title: string,
  category: string,
  extra: Other,
) => {
  let create_error: CreateError = {
    title: "",
    category: "",
    cook: "",
    prep: "",
    level: "",
    total: "",
    yield: "",
  };

  let status = false;


  status = checkEmpty("title", create_error, title);
  status = checkEmpty("category", create_error, category);
  status = checkEmpty("cook", create_error, extra.cook);
  status = checkEmpty("prep", create_error, extra.prep);
  status = checkEmpty("level", create_error, extra.level);
  status = checkEmpty("total", create_error, extra.total);
  status = checkEmpty("yield", create_error, extra.yield);

  return { status, create_error };
};

const isRequired = (prop: string, value: string) => {
  if (value == "") {
    return { [prop]: "field required" };
  }
  return true;
};

export { signup_validator, login_validator, isRequired, create_validator };
