#[derive(Debug)]
pub struct Resp<T> {
    pub msg: String,
    pub data: Option<T>,
    pub success: bool,
}

impl<T> Resp<T> {
    pub fn success(msg: impl Into<String>, data: Option<T>) -> Self {
        Resp {
            msg: msg.into(),
            data,
            success: true,
        }
    }

    pub fn error(msg: impl Into<String>) -> Self {
        Resp {
            msg: msg.into(),
            data: None,
            success: false,
        }
    }
}

pub fn main() {
    // Example usage of Resp

    let success_response: Resp<&str> = Resp::success("Operation successful", Some("data"));
    println!("Success Response: {:?}", success_response);

    let error_response: Resp<()> = Resp::error("An error occurred");
    println!("Error Response: {:?}", error_response);
}
