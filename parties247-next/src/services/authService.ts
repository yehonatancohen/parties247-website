/**
 * Simulates a login API call.
 * In a real application, this would make a fetch request to a backend server.
 * The server would validate the password and return a JWT upon success.
 *
 * IMPORTANT: This is for demonstration purposes only. The password check is
 * still happening on the client-side, which is insecure. A real implementation
 * MUST perform authentication on a server.
 */
export const login = (password: string): Promise<{ token: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // The password check is happening here. In a real app, this logic
      // would be on the server, and process.env.ADMIN_PASSWORD would be a
      // server-side environment variable, not exposed to the client.
      if (password === process.env.ADMIN_PASSWORD) {
        // Return a mock token upon success.
        resolve({ token: 'mock-jwt-token-for-session' });
      } else {
        // Reject the promise on failure.
        reject(new Error('Invalid credentials'));
      }
    }, 750); // Simulate network delay
  });
};
