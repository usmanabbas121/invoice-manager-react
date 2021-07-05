const UserRegisterationSchema = {
  type: "object",
  required: [
    "name",
    "email",
    "password",
    "role",
    "created_by",
    "status",
  ],
  properties: {
    name: {
      type: "string",
    },
    email: {
      type: "string",
    },
    created_by: {
      type: "number",
    },
    password: {
      type: "string",
    },
    role: {
      type: "string",
    },
    status: {
      type: "string",
    }
  },
};

module.exports = { UserRegisterationSchema };
