const Resp = {
  success: (msg: string, data?: any) => ({ msg, data, success: true }),
  error: (msg: string) => ({ msg, success: false }),
};

export default Resp;
