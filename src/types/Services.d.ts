 interface ILoginUserBody {
  email: string;
  password: string;
}
interface Syllabus {
  jobCategory: string;
  jobTitle: string;
    releasedDate: string;
  file: string;
}

 interface RegisterUserBody {
 username,
  email,
  password,
}

 interface SendEmailOtpBody {
  email: string;
}

 interface VerifyEmailOtpBody {
  email: string;
  otp: string;
}

 interface SendMobileOtpBody {
  mobile: string;
}

 interface VerifyMobileOtpBody {
  mobile: string;
  otp: string;
}

interface UploadCutoffBody {
  [key: string]: any;
}

interface ReviewData {
  [key: string]: any;
}

