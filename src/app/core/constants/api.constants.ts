export const ApiConstants = {
  auth: {
    login: '/users/login',
    register: '/users/register',
    instructorLogin: '/instructor/login',
    instructorRegister: '/instructor/register',
    adminLogin: '/admin/auth/login',
    verifyEmail: '/auth/verify-email',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    refreshToken: '/admin/auth/refresh-token'
    
  },

  admin: {
    instructors: {
      list: '/admin/instructors',
      details: '/admin/instructors/:id',
      approve: '/admin/instructors/:id/approve',
      reject: '/admin/instructors/:id/reject',
      block: '/admin/instructors/:id/block'
    },

    students: {
      list: '/admin/students',
      dashboard: '/admin/students/dashboard',
      detail: '/admin/students/:studentId',
      activate: '/admin/students/:studentId/activate',
      suspend: '/admin/students/:studentId/suspend',
      profileImage: '/admin/students/:studentId/profile-image',
      changePassword: '/admin/students/:studentId/change-password',
      progress: '/admin/students/:studentId/progress',
      certificate: '/admin/students/:studentId/certificate',
      bulkDelete: '/admin/students/bulk-delete',
      bulkActivate: '/admin/students/bulk-activate',
      bulkSuspend: '/admin/students/bulk-suspend',
      export: '/admin/students/export',
      exportSelected: '/admin/students/export-selected'
    }
  }
};
