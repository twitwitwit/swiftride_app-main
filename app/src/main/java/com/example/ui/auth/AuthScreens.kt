package com.example.ui.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.UserRole
import com.example.ui.components.SwiftRideLogoBadge
import com.example.ui.theme.SwiftBorder
import com.example.ui.theme.SwiftDark
import com.example.ui.theme.SwiftGold
import com.example.ui.theme.SwiftGoldDark
import com.example.ui.theme.SwiftGoldLight
import com.example.ui.theme.SwiftGreen
import com.example.ui.theme.SwiftTextMuted
import com.example.ui.theme.SwiftTextPrimary
import com.example.ui.theme.SwiftTextSecondary
import com.example.ui.theme.SwiftWhite
import com.example.ui.viewmodel.SwiftRideViewModel

@Composable
fun AuthScreen(
    viewModel: SwiftRideViewModel,
    onLoginSuccess: () -> Unit
) {
    var isSignUp by remember { mutableStateOf(false) }
    var selectedRole by remember { mutableStateOf(UserRole.PASSENGER) }

    Surface(
        modifier = Modifier
            .fillMaxSize()
            .statusBarsPadding()
            .navigationBarsPadding(),
        color = SwiftWhite
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(8.dp))
            SwiftRideLogoBadge(showSubtitle = true)
            Spacer(modifier = Modifier.height(20.dp))

            // Role Switcher Toggle (PASSENGER / DRIVER) - Exactly matching Slide 3 & 7
            RoleSwitcher(
                selectedRole = selectedRole,
                onRoleSelected = {
                    selectedRole = it
                    viewModel.setUserRole(it)
                }
            )

            Spacer(modifier = Modifier.height(20.dp))

            if (!isSignUp) {
                LoginView(
                    selectedRole = selectedRole,
                    onLogin = {
                        viewModel.login(selectedRole)
                        onLoginSuccess()
                    },
                    onSwitchToSignUp = { isSignUp = true }
                )
            } else {
                SignUpView(
                    selectedRole = selectedRole,
                    onSignUp = { name, phone, email ->
                        viewModel.signUp(name, phone, email, selectedRole)
                        onLoginSuccess()
                    },
                    onSwitchToLogin = { isSignUp = false }
                )
            }
        }
    }
}

@Composable
fun RoleSwitcher(
    selectedRole: UserRole,
    onRoleSelected: (UserRole) -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(48.dp)
            .clip(RoundedCornerShape(24.dp))
            .background(Color(0xFFF2F4F7))
            .border(1.dp, SwiftBorder, RoundedCornerShape(24.dp))
            .padding(4.dp)
    ) {
        Row(modifier = Modifier.fillMaxSize()) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(20.dp))
                    .background(if (selectedRole == UserRole.PASSENGER) SwiftGold else Color.Transparent)
                    .clickable { onRoleSelected(UserRole.PASSENGER) }
                    .padding(vertical = 8.dp)
                    .testTag("role_passenger_btn"),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "👤 PASSENGER",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (selectedRole == UserRole.PASSENGER) SwiftDark else SwiftTextSecondary
                )
            }
            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(20.dp))
                    .background(if (selectedRole == UserRole.DRIVER) SwiftGold else Color.Transparent)
                    .clickable { onRoleSelected(UserRole.DRIVER) }
                    .padding(vertical = 8.dp)
                    .testTag("role_driver_btn"),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "🚗 DRIVER",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (selectedRole == UserRole.DRIVER) SwiftDark else SwiftTextSecondary
                )
            }
        }
    }
}

@Composable
private fun LoginView(
    selectedRole: UserRole,
    onLogin: () -> Unit,
    onSwitchToSignUp: () -> Unit
) {
    var emailOrPhone by remember { mutableStateOf("0912 345 6789") }
    var password by remember { mutableStateOf("password123") }
    var passwordVisible by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Welcome Back!",
            fontFamily = com.example.ui.theme.PoppinsFontFamily,
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            color = SwiftDark,
            modifier = Modifier.align(Alignment.Start)
        )
        Text(
            text = if (selectedRole == UserRole.PASSENGER) "Log in to continue as passenger" else "Log in to continue as driver",
            fontSize = 13.sp,
            color = SwiftTextSecondary,
            modifier = Modifier.align(Alignment.Start)
        )

        Spacer(modifier = Modifier.height(18.dp))

        OutlinedTextField(
            value = emailOrPhone,
            onValueChange = { emailOrPhone = it },
            label = { Text("Email or Phone Number") },
            leadingIcon = {
                Icon(imageVector = Icons.Default.Email, contentDescription = null, tint = SwiftGoldDark)
            },
            modifier = Modifier
                .fillMaxWidth()
                .testTag("login_email_input"),
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = SwiftGold,
                unfocusedBorderColor = SwiftBorder
            )
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") },
            leadingIcon = {
                Icon(imageVector = Icons.Default.Lock, contentDescription = null, tint = SwiftGoldDark)
            },
            trailingIcon = {
                IconButton(onClick = { passwordVisible = !passwordVisible }) {
                    Icon(
                        imageVector = if (passwordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                        contentDescription = "Toggle password"
                    )
                }
            },
            visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
            modifier = Modifier
                .fillMaxWidth()
                .testTag("login_password_input"),
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = SwiftGold,
                unfocusedBorderColor = SwiftBorder
            )
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.End
        ) {
            TextButton(onClick = { /* Forgot password */ }) {
                Text(
                    text = "Forgot Password?",
                    fontSize = 12.sp,
                    color = SwiftGoldDark,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        Button(
            onClick = onLogin,
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
                .testTag("login_submit_btn"),
            shape = RoundedCornerShape(14.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = SwiftGold,
                contentColor = SwiftDark
            )
        ) {
            Text(
                text = "Log In",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold
            )
        }

        Spacer(modifier = Modifier.height(18.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            HorizontalDivider(modifier = Modifier.weight(1f), color = SwiftBorder)
            Text(
                text = "  or  ",
                fontSize = 12.sp,
                color = SwiftTextMuted
            )
            HorizontalDivider(modifier = Modifier.weight(1f), color = SwiftBorder)
        }

        Spacer(modifier = Modifier.height(16.dp))

        SocialLoginButton(title = "Continue with Google", icon = "G")
        Spacer(modifier = Modifier.height(8.dp))
        SocialLoginButton(title = "Continue with Facebook", icon = "f")
        Spacer(modifier = Modifier.height(8.dp))
        SocialLoginButton(title = "Continue with Apple", icon = "")

        Spacer(modifier = Modifier.height(18.dp))

        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                text = "Don't have an account? ",
                fontSize = 13.sp,
                color = SwiftTextSecondary
            )
            Text(
                text = "Sign Up",
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                color = SwiftGoldDark,
                modifier = Modifier
                    .clickable { onSwitchToSignUp() }
                    .testTag("switch_to_signup")
            )
        }
    }
}

@Composable
private fun SignUpView(
    selectedRole: UserRole,
    onSignUp: (String, String, String) -> Unit,
    onSwitchToLogin: () -> Unit
) {
    var fullName by remember { mutableStateOf(if (selectedRole == UserRole.PASSENGER) "John Michael Nabung" else "Juan Dela Cruz") }
    var phoneNumber by remember { mutableStateOf("0912 345 6789") }
    var email by remember { mutableStateOf("john.nabung@example.com") }
    var vehicleType by remember { mutableStateOf("Sedan") }
    var plateNumber by remember { mutableStateOf("NDA 1234") }
    var city by remember { mutableStateOf("Caloocan City") }

    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = if (selectedRole == UserRole.PASSENGER) "Create Your Account" else "Create Driver Account",
            fontFamily = com.example.ui.theme.PoppinsFontFamily,
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            color = SwiftDark,
            modifier = Modifier.align(Alignment.Start)
        )
        Text(
            text = if (selectedRole == UserRole.PASSENGER) "Sign up as a passenger" else "Sign up to start driving with SwiftRide",
            fontSize = 13.sp,
            color = SwiftTextSecondary,
            modifier = Modifier.align(Alignment.Start)
        )

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = fullName,
            onValueChange = { fullName = it },
            label = { Text("Full Name") },
            leadingIcon = { Icon(Icons.Default.Person, contentDescription = null, tint = SwiftGoldDark) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )

        Spacer(modifier = Modifier.height(10.dp))

        OutlinedTextField(
            value = phoneNumber,
            onValueChange = { phoneNumber = it },
            label = { Text("Phone Number") },
            leadingIcon = { Icon(Icons.Default.Phone, contentDescription = null, tint = SwiftGoldDark) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )

        Spacer(modifier = Modifier.height(10.dp))

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email Address") },
            leadingIcon = { Icon(Icons.Default.Email, contentDescription = null, tint = SwiftGoldDark) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )

        // Driver Information specific fields (Slide 7)
        if (selectedRole == UserRole.DRIVER) {
            Spacer(modifier = Modifier.height(14.dp))
            Text(
                text = "Driver Information",
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = SwiftTextPrimary,
                modifier = Modifier.align(Alignment.Start)
            )
            Spacer(modifier = Modifier.height(8.dp))

            OutlinedTextField(
                value = vehicleType,
                onValueChange = { vehicleType = it },
                label = { Text("Vehicle Type (Sedan, SUV, Van, Motorcycle)") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))

            OutlinedTextField(
                value = plateNumber,
                onValueChange = { plateNumber = it },
                label = { Text("Plate Number") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))

            OutlinedTextField(
                value = city,
                onValueChange = { city = it },
                label = { Text("City") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Security badge card (Slide 3 & 7)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp))
                .background(Color(0xFFFFFBF0))
                .border(1.dp, SwiftGoldLight, RoundedCornerShape(12.dp))
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(SwiftGold),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Security,
                    contentDescription = null,
                    tint = SwiftDark,
                    modifier = Modifier.size(20.dp)
                )
            }
            Spacer(modifier = Modifier.width(10.dp))
            Column {
                Text(
                    text = if (selectedRole == UserRole.PASSENGER) "Your Safety is Our Priority" else "Drive with Confidence",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = SwiftTextPrimary
                )
                Text(
                    text = "We never share your personal information with anyone.",
                    fontSize = 11.sp,
                    color = SwiftTextSecondary
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = { onSignUp(fullName, phoneNumber, email) },
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
                .testTag("signup_submit_btn"),
            shape = RoundedCornerShape(14.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = SwiftGold,
                contentColor = SwiftDark
            )
        ) {
            Text(
                text = "Sign Up",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                text = "Already have an account? ",
                fontSize = 13.sp,
                color = SwiftTextSecondary
            )
            Text(
                text = "Log In",
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                color = SwiftGoldDark,
                modifier = Modifier
                    .clickable { onSwitchToLogin() }
                    .testTag("switch_to_login")
            )
        }
    }
}

@Composable
private fun SocialLoginButton(title: String, icon: String) {
    OutlinedButton(
        onClick = { /* Social login */ },
        modifier = Modifier
            .fillMaxWidth()
            .height(46.dp),
        shape = RoundedCornerShape(12.dp),
        colors = ButtonDefaults.outlinedButtonColors(contentColor = SwiftTextPrimary),
        border = androidx.compose.foundation.BorderStroke(1.dp, SwiftBorder)
    ) {
        Text(
            text = icon,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(end = 8.dp)
        )
        Text(
            text = title,
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold
        )
    }
}
