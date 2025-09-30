use std::fmt;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum AvatarType {
    Personas,
    Initials,
    Shapes,
    Identicon,
    Bottts,
    Avataaars,
}

impl AvatarType {
    pub fn as_str(&self) -> &'static str {
        match self {
            AvatarType::Personas => "personas",
            AvatarType::Initials => "initials",
            AvatarType::Shapes => "shapes",
            AvatarType::Identicon => "identicon",
            AvatarType::Bottts => "bottts",
            AvatarType::Avataaars => "avataaars",
        }
    }
}

impl fmt::Display for AvatarType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.as_str())
    }
}

pub fn generate_avatar(nickname: String, type_ava: AvatarType) -> String {
    format!(
        "https://api.dicebear.com/9.x/{}/svg?seed={}",
        type_ava, nickname
    )
}
