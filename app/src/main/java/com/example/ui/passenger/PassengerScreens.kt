package com.example.ui.passenger

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.DirectionsCar
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.HeadsetMic
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.NotificationImportant
import androidx.compose.material.icons.filled.Payment
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.QrCode
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material.icons.filled.Work
import androidx.compose.material.icons.outlined.BookmarkBorder
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.TimePicker
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.material3.rememberTimePickerState
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.window.Dialog
import java.util.Calendar
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.R
import com.example.data.model.RideEntity
import com.example.data.model.RideStatus
import com.example.data.model.UserRole
import com.example.data.model.VehicleType
import com.example.ui.components.LeafletMapView
import com.example.ui.components.RealTimeGpsMapView
import com.example.ui.components.TopUpWalletDialog
import com.example.ui.components.VehicleIconBadge
import com.example.ui.theme.SwiftBorder
import com.example.ui.theme.SwiftDark
import com.example.ui.theme.SwiftDarkCard
import com.example.ui.theme.SwiftGold
import com.example.ui.theme.SwiftGoldBorder
import com.example.ui.theme.SwiftGoldDark
import com.example.ui.theme.SwiftGoldLight
import com.example.ui.theme.SwiftGrayBg
import com.example.ui.theme.SwiftGreen
import com.example.ui.theme.SwiftGreenBg
import com.example.ui.theme.SwiftGreenText
import com.example.ui.theme.SwiftRed
import com.example.ui.theme.SwiftRedBg
import com.example.ui.theme.SwiftRedText
import com.example.ui.theme.SwiftTextMuted
import com.example.ui.theme.SwiftTextPrimary
import com.example.ui.theme.SwiftTextSecondary
import com.example.ui.theme.SwiftWhite
import com.example.ui.viewmodel.SwiftRideViewModel

// ==========================================
// 1. PASSENGER HOME SCREEN (Slide 4)
// ==========================================
@Composable
fun PassengerHomeScreen(
    viewModel: SwiftRideViewModel,
    onNavigateToBook: (VehicleType?) -> Unit,
    onNavigateToHistory: () -> Unit,
    onNavigateToActiveRide: () -> Unit = {}
) {
    val scrollState = rememberScrollState()
    val activeRide by viewModel.activeRide.collectAsState()
    val rideStatus by viewModel.rideStatus.collectAsState()
    val etaMinutes by viewModel.etaMinutes.collectAsState()

    val userName by viewModel.userName.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(bottom = 16.dp)
    ) {
        // Greeting & Search bar
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 12.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Hello, ${userName.split(" ").firstOrNull() ?: "User"}!",
                        fontFamily = com.example.ui.theme.PoppinsFontFamily,
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = SwiftDark
                    )
                    Text(
                        text = "Where are you going today?",
                        fontSize = 13.sp,
                        color = SwiftTextSecondary
                    )
                }

                // Notification Bell icon instead of role toggle
                IconButton(onClick = { /* TODO: Open Notifications */ }) {
                    Icon(
                        imageVector = Icons.Default.Notifications,
                        contentDescription = "Notifications",
                        tint = SwiftDark
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Search destination input
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onNavigateToBook(null) }
                    .testTag("home_search_destination"),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = SwiftWhite),
                elevation = CardDefaults.cardElevation(2.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = null,
                        tint = SwiftGoldDark,
                        modifier = Modifier.size(22.dp)
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(
                        text = "Where are you going?",
                        fontSize = 14.sp,
                        color = SwiftTextMuted,
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        }

        // Active Trip in Progress banner (with link to Leaflet Map)
        if (activeRide != null && (rideStatus == RideStatus.ACCEPTED || rideStatus == RideStatus.DRIVER_ARRIVED || rideStatus == RideStatus.IN_PROGRESS)) {
            val currentRide = activeRide!!
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 6.dp)
                    .clickable { onNavigateToActiveRide() }
                    .testTag("home_active_ride_card"),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = SwiftDark),
                elevation = CardDefaults.cardElevation(4.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(10.dp)
                                    .clip(CircleShape)
                                    .background(if (rideStatus == RideStatus.DRIVER_ARRIVED) SwiftGreen else SwiftGold)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = when (rideStatus) {
                                    RideStatus.ACCEPTED -> "Driver is on the way"
                                    RideStatus.DRIVER_ARRIVED -> "Driver arrived at pickup!"
                                    RideStatus.IN_PROGRESS -> "Trip in progress"
                                    else -> "Active Trip"
                                },
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = SwiftWhite
                            )
                        }
                        Text(
                            text = if (etaMinutes > 0) "ETA: $etaMinutes mins" else "Arrived",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = SwiftGold
                        )
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "${currentRide.driverName} • ${currentRide.vehiclePlate}",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = SwiftWhite
                            )
                            Text(
                                text = "${currentRide.pickupAddress} ➔ ${currentRide.dropoffAddress}",
                                fontSize = 11.sp,
                                color = Color(0xFFD0D5DD),
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Button(
                            onClick = onNavigateToActiveRide,
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = SwiftGold,
                                contentColor = SwiftDark
                            ),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                            modifier = Modifier.height(34.dp)
                        ) {
                            Text(text = "View Map ➔", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Hero Promo Banner matching Slide 4 ("Fast and Safe Travel - Ride with SwiftRide - Get 50% OFF")
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 6.dp)
                .clip(RoundedCornerShape(20.dp))
                .background(
                    Brush.horizontalGradient(
                        colors = listOf(Color(0xFFFFC700), Color(0xFFFFD633))
                    )
                )
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Fast and Safe Travel",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = SwiftDark
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Ride with SwiftRide",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black,
                        color = SwiftDark
                    )
                    Text(
                        text = "Get 50% OFF on your first ride!",
                        fontSize = 12.sp,
                        color = SwiftTextSecondary
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Button(
                        onClick = { onNavigateToBook(VehicleType.SEDAN) },
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = SwiftDark,
                            contentColor = SwiftWhite
                        ),
                        modifier = Modifier.height(36.dp)
                    ) {
                        Text(text = "Book Now", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }

                // 50% OFF badge and car
                Column(horizontalAlignment = Alignment.End) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .background(SwiftDark)
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = "50%\nOFF",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Black,
                            color = SwiftGold,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Image(
                        painter = painterResource(id = R.drawable.hero_car_banner),
                        contentDescription = "Car Banner",
                        modifier = Modifier
                            .size(110.dp, 64.dp)
                            .clip(RoundedCornerShape(10.dp)),
                        contentScale = ContentScale.Crop
                    )
                }
            }
        }

        // Choose a ride section (Slide 4)
        Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Choose a ride",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = SwiftTextPrimary
                )
                Text(
                    text = "See all",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = SwiftGoldDark,
                    modifier = Modifier.clickable { onNavigateToBook(null) }
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                VehicleType.entries.forEach { vehicle ->
                    Card(
                        modifier = Modifier
                            .weight(1f)
                            .clickable { onNavigateToBook(vehicle) },
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = SwiftWhite),
                        elevation = CardDefaults.cardElevation(1.dp)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(10.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            VehicleIconBadge(vehicleType = vehicle)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = vehicle.title,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = SwiftTextPrimary
                            )
                            Text(
                                text = vehicle.capacity,
                                fontSize = 10.sp,
                                color = SwiftTextMuted
                            )
                        }
                    }
                }
            }
        }

        // Recent destinations (Slide 4)
        Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Recent destinations",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = SwiftTextPrimary
                )
                Text(
                    text = "See all",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = SwiftGoldDark,
                    modifier = Modifier.clickable { onNavigateToHistory() }
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            listOf(
                Triple("SM City Fairview", "SM Fairview, Quezon City", Icons.Default.LocationOn),
                Triple("University of Caloocan City", "Bigte, Caloocan City", Icons.Default.Bookmark),
                Triple("Home", "Bagong Silang, Caloocan City", Icons.Default.Home)
            ).forEach { (title, subtitle, icon) ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                        .clickable { onNavigateToBook(VehicleType.SEDAN) },
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = SwiftWhite),
                    elevation = CardDefaults.cardElevation(1.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(38.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .background(SwiftGoldLight),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = icon,
                                contentDescription = null,
                                tint = SwiftGoldDark,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = title,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = SwiftTextPrimary
                            )
                            Text(
                                text = subtitle,
                                fontSize = 12.sp,
                                color = SwiftTextSecondary
                            )
                        }
                        Icon(
                            imageVector = Icons.Outlined.BookmarkBorder,
                            contentDescription = "Save destination",
                            tint = SwiftTextMuted,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }
        }

        // Special offers for you (Slide 4)
        Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 10.dp)) {
            Text(
                text = "Special offers for you",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = SwiftTextPrimary
            )
            Spacer(modifier = Modifier.height(10.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFFF9E6)),
                border = androidx.compose.foundation.BorderStroke(1.dp, SwiftGoldBorder)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .clip(CircleShape)
                            .background(SwiftGold),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "%",
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Black,
                            color = SwiftDark
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "₱50 OFF",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = SwiftTextPrimary
                        )
                        Text(
                            text = "Use code: TNV550",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = SwiftGoldDark
                        )
                        Text(
                            text = "Valid for all ride types",
                            fontSize = 11.sp,
                            color = SwiftTextSecondary
                        )
                    }
                    Button(
                        onClick = { onNavigateToBook(VehicleType.SEDAN) },
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = SwiftGold,
                            contentColor = SwiftDark
                        ),
                        modifier = Modifier.height(36.dp)
                    ) {
                        Text(text = "Use Now", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

// ==========================================
// 2. BOOK RIDE SCREEN (Slide 4)
// ==========================================
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BookRideScreen(
    viewModel: SwiftRideViewModel,
    initialVehicle: VehicleType? = null,
    onBack: () -> Unit
) {
    var pickup by remember { mutableStateOf("Bagong Silang, Caloocan City") }
    var dropoff by remember { mutableStateOf("SM North EDSA, Quezon City") }
    var selectedVehicle by remember { mutableStateOf(initialVehicle ?: VehicleType.SEDAN) }
    var paymentMethod by remember { mutableStateOf("VISA **** 1234") }
    var promoCode by remember { mutableStateOf("TNV550") }
    var showFareDetails by remember { mutableStateOf(false) }
    var passengerCountText by remember { mutableStateOf("1") }
    
    val isScheduledMode by viewModel.isScheduledMode.collectAsState()
    val scheduledTime by viewModel.scheduledTime.collectAsState()

    var showDatePicker by remember { mutableStateOf(false) }
    var showTimePicker by remember { mutableStateOf(false) }
    val datePickerState = rememberDatePickerState()
    val timePickerState = rememberTimePickerState()

    var showPaymentSelection by remember { mutableStateOf(false) }

    val passengerCount = passengerCountText.toIntOrNull() ?: 0
    val isVehicleAvailable = passengerCount <= selectedVehicle.maxSeats

    val hasDiscount = promoCode.equals("TNV550", ignoreCase = true)
    val origFare = selectedVehicle.baseFare
    val discount = if (hasDiscount) origFare * 0.5 else 0.0
    val finalFare = origFare - discount

    if (showDatePicker) {
        DatePickerDialog(
            onDismissRequest = { showDatePicker = false },
            confirmButton = {
                TextButton(onClick = {
                    datePickerState.selectedDateMillis?.let {
                        val cal = Calendar.getInstance().apply { timeInMillis = it }
                        val dateStr = "${cal.get(Calendar.MONTH) + 1}/${cal.get(Calendar.DAY_OF_MONTH)}/${cal.get(Calendar.YEAR)}"
                        viewModel.triggerPushNotification("Date Selected", "You selected $dateStr", "INFO")
                    }
                    showDatePicker = false
                    showTimePicker = true
                }) { Text("Next") }
            }
        ) {
            DatePicker(state = datePickerState)
        }
    }

    if (showTimePicker) {
        Dialog(onDismissRequest = { showTimePicker = false }) {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = SwiftWhite,
                modifier = Modifier.padding(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("Select Time", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    Spacer(modifier = Modifier.height(16.dp))
                    TimePicker(state = timePickerState)
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                        TextButton(onClick = { showTimePicker = false }) { Text("Cancel") }
                        Button(onClick = {
                            val timeStr = "${timePickerState.hour}:${timePickerState.minute.toString().padStart(2, '0')}"
                            viewModel.setScheduledTime(timeStr)
                            if (!isScheduledMode) viewModel.toggleScheduledMode()
                            showTimePicker = false
                        }) { Text("Confirm") }
                    }
                }
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(bottom = 24.dp)
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
            }
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "Book a Ride",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = SwiftTextPrimary
            )
        }

        // Pickup & Dropoff Inputs (Slide 4)
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 6.dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = SwiftWhite),
            elevation = CardDefaults.cardElevation(2.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(10.dp)
                            .clip(CircleShape)
                            .background(SwiftGreen)
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(text = "Pickup location", fontSize = 11.sp, color = SwiftTextMuted)
                        OutlinedTextField(
                            value = pickup,
                            onValueChange = { pickup = it },
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Color.Transparent,
                                unfocusedBorderColor = Color.Transparent
                            )
                        )
                    }
                }

                HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp), color = SwiftBorder)

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(10.dp)
                            .clip(CircleShape)
                            .background(SwiftGoldDark)
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(text = "Drop-off location", fontSize = 11.sp, color = SwiftTextMuted)
                        OutlinedTextField(
                            value = dropoff,
                            onValueChange = { dropoff = it },
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Color.Transparent,
                                unfocusedBorderColor = Color.Transparent
                            )
                        )
                    }
                    IconButton(onClick = { /* Add stop */ }, modifier = Modifier.size(32.dp)) {
                        Icon(Icons.Default.Add, contentDescription = "Add stop", tint = SwiftTextSecondary)
                    }
                }
            }
        }

        // Leaflet Map Route Preview
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 6.dp)
                .height(175.dp),
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(containerColor = SwiftWhite),
            elevation = CardDefaults.cardElevation(2.dp)
        ) {
            Box(modifier = Modifier.fillMaxSize()) {
                LeafletMapView(
                    progress = 0.0f,
                    pickupTitle = pickup,
                    dropoffTitle = dropoff,
                    showControls = false,
                    isInteractive = true,
                    modifier = Modifier.fillMaxSize()
                )
            }
        }

        // Shortcuts: Home, Work, Favorites, Recent (Slide 4)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            listOf("Home" to Icons.Default.Home, "Work" to Icons.Default.Work, "Favorites" to Icons.Default.Star, "Recent" to Icons.Default.History).forEach { (label, icon) ->
                Row(
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(SwiftWhite)
                        .border(1.dp, SwiftBorder, RoundedCornerShape(20.dp))
                        .clickable { dropoff = if (label == "Home") "Bagong Silang, Caloocan City" else "SM North EDSA, Quezon City" }
                        .padding(horizontal = 10.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(icon, contentDescription = null, tint = SwiftGoldDark, modifier = Modifier.size(14.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = label, fontSize = 11.sp, color = SwiftTextPrimary)
                }
            }
        }

        // Parameters: Date & Time, Passengers, Preferences
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 6.dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = SwiftWhite),
            elevation = CardDefaults.cardElevation(1.dp)
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Schedule, contentDescription = null, tint = SwiftGoldDark, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(text = "Date & Time", fontSize = 13.sp, color = SwiftTextSecondary)
                    }
                    Text(
                        text = if (isScheduledMode) "Scheduled • $scheduledTime >" else "Today • Now >",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = SwiftTextPrimary,
                        modifier = Modifier.clickable { showDatePicker = true }
                    )
                }
                HorizontalDivider(modifier = Modifier.padding(vertical = 10.dp), color = SwiftBorder)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.People, contentDescription = null, tint = SwiftGoldDark, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(text = "Passengers", fontSize = 13.sp, color = SwiftTextSecondary)
                    }
                    Box(modifier = Modifier.width(60.dp)) {
                        OutlinedTextField(
                            value = passengerCountText,
                            onValueChange = { if (it.length <= 2) passengerCountText = it },
                            modifier = Modifier.fillMaxWidth(),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            singleLine = true,
                            textStyle = androidx.compose.ui.text.TextStyle(fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = SwiftTextPrimary),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = SwiftGold,
                                unfocusedBorderColor = SwiftBorder
                            )
                        )
                    }
                }
            }
        }

        // Choose a ride cards (Slide 4)
        Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 10.dp)) {
            Text(
                text = "Choose a ride",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = SwiftTextPrimary
            )
            Spacer(modifier = Modifier.height(10.dp))

            VehicleType.entries.forEach { vehicle ->
                val isSelected = selectedVehicle == vehicle
                val canChoose = passengerCount <= vehicle.maxSeats
                
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 5.dp)
                        .clickable(enabled = canChoose) { selectedVehicle = vehicle },
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (isSelected) SwiftGoldLight else if (canChoose) SwiftWhite else SwiftGrayBg.copy(alpha = 0.5f)
                    ),
                    border = androidx.compose.foundation.BorderStroke(
                        1.dp,
                        if (isSelected) SwiftGold else if (canChoose) SwiftBorder else Color.Transparent
                    )
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        VehicleIconBadge(vehicleType = vehicle, isSelected = isSelected)
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = vehicle.title,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (canChoose) SwiftTextPrimary else SwiftTextMuted
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = vehicle.capacity,
                                    fontSize = 11.sp,
                                    color = SwiftTextMuted
                                )
                            }
                            if (!canChoose) {
                                Text(
                                    text = "Max ${vehicle.maxSeats} passengers",
                                    fontSize = 11.sp,
                                    color = SwiftRed,
                                    fontWeight = FontWeight.Bold
                                )
                            } else {
                                Text(
                                    text = vehicle.description,
                                    fontSize = 11.sp,
                                    color = SwiftTextSecondary,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                        }
                        Column(horizontalAlignment = Alignment.End) {
                            Text(
                                text = "₱${vehicle.baseFare.toInt()}",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Black,
                                color = if (canChoose) SwiftTextPrimary else SwiftTextMuted
                            )
                            Text(
                                text = vehicle.etaMinutes,
                                fontSize = 11.sp,
                                color = if (canChoose) SwiftGreenText else SwiftTextMuted,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                        Spacer(modifier = Modifier.width(6.dp))
                        RadioButton(
                            selected = isSelected,
                            onClick = { selectedVehicle = vehicle },
                            enabled = canChoose,
                            colors = RadioButtonDefaults.colors(selectedColor = SwiftGoldDark)
                        )
                    }
                }
            }
        }

        // Payment Method & Promo Code
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 6.dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = SwiftWhite),
            elevation = CardDefaults.cardElevation(1.dp)
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Payment, contentDescription = null, tint = SwiftGoldDark, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(text = "Payment Method", fontSize = 13.sp, color = SwiftTextSecondary)
                    }
                    Box {
                        Text(
                            text = "$paymentMethod >",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = SwiftTextPrimary,
                            modifier = Modifier.clickable { showPaymentSelection = true }
                        )
                        DropdownMenu(
                            expanded = showPaymentSelection,
                            onDismissRequest = { showPaymentSelection = false }
                        ) {
                            listOf("SwiftRide Wallet", "GCash", "Cash", "Credit/Debit Card").forEach { method ->
                                DropdownMenuItem(
                                    text = { Text(method) },
                                    onClick = {
                                        paymentMethod = method
                                        showPaymentSelection = false
                                    }
                                )
                            }
                        }
                    }
                }

                HorizontalDivider(modifier = Modifier.padding(vertical = 10.dp), color = SwiftBorder)

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Tune, contentDescription = null, tint = SwiftGoldDark, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(text = "Promo Code", fontSize = 13.sp, color = SwiftTextSecondary)
                    }
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        OutlinedTextField(
                            value = promoCode,
                            onValueChange = { promoCode = it },
                            modifier = Modifier.width(100.dp),
                            singleLine = true,
                            textStyle = androidx.compose.ui.text.TextStyle(fontSize = 11.sp, fontWeight = FontWeight.Bold, color = if (hasDiscount) SwiftGreenText else SwiftTextPrimary),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = if (hasDiscount) SwiftGreen else SwiftGold,
                                unfocusedBorderColor = SwiftBorder
                            )
                        )
                        if (hasDiscount) {
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(text = "✓", fontSize = 11.sp, color = SwiftGreenText, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Fare Estimate & Confirm Booking Button (Slide 4)
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 10.dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = SwiftWhite),
            elevation = CardDefaults.cardElevation(2.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(text = "Estimated Fare", fontSize = 12.sp, color = SwiftTextSecondary)
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "₱${finalFare.toInt()}",
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Black,
                                color = SwiftTextPrimary
                            )
                            if (hasDiscount) {
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "₱${origFare.toInt()}",
                                    fontSize = 14.sp,
                                    color = SwiftTextMuted,
                                    style = androidx.compose.ui.text.TextStyle(textDecoration = androidx.compose.ui.text.style.TextDecoration.LineThrough)
                                )
                            }
                        }
                    }

                    TextButton(onClick = { showFareDetails = !showFareDetails }) {
                        Text(
                            text = if (showFareDetails) "Hide Details ∧" else "Details ∨",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = SwiftGoldDark
                        )
                    }
                }

                if (showFareDetails) {
                    Spacer(modifier = Modifier.height(10.dp))
                    HorizontalDivider(color = SwiftBorder)
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(text = "Base Vehicle Fare", fontSize = 12.sp, color = SwiftTextSecondary)
                        Text(text = "₱${origFare.toInt()}", fontSize = 12.sp, color = SwiftTextPrimary)
                    }
                    if (hasDiscount) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text(text = "TNV550 Discount (50% OFF)", fontSize = 12.sp, color = SwiftGreenText)
                            Text(text = "-₱${discount.toInt()}", fontSize = 12.sp, color = SwiftGreenText, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Button(
                    onClick = {
                        viewModel.bookRide(
                            pickup = pickup,
                            dropoff = dropoff,
                            vehicleType = selectedVehicle,
                            paymentMethod = paymentMethod,
                            promoCode = promoCode,
                            isScheduled = isScheduledMode,
                            scheduledTime = if (isScheduledMode) scheduledTime else null
                        )
                    },
                    enabled = isVehicleAvailable,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp)
                        .testTag("confirm_booking_btn"),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isVehicleAvailable) SwiftGold else SwiftTextMuted,
                        contentColor = SwiftDark
                    )
                ) {
                    Text(
                        text = if (isVehicleAvailable) "Confirm Booking" else "Too many passengers",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

// ==========================================
// 3. REAL-TIME GPS TRACKING SCREEN
// ==========================================
@Composable
fun ActiveRideTrackingScreen(
    viewModel: SwiftRideViewModel,
    onNavigateToChat: () -> Unit,
    onBackToHome: () -> Unit = {}
) {
    val activeRide by viewModel.activeRide.collectAsState()
    val rideStatus by viewModel.rideStatus.collectAsState()
    val gpsProgress by viewModel.gpsProgress.collectAsState()
    val etaMinutes by viewModel.etaMinutes.collectAsState()

    val ride = activeRide ?: RideEntity(
        id = 1,
        passengerName = "John Michael Nabung",
        driverName = "Juan Dela Cruz",
        vehicleType = "Sedan",
        vehicleModel = "Toyota Vios (Black)",
        vehiclePlate = "NDA 1234",
        pickupAddress = "Bagong Silang, Caloocan City",
        dropoffAddress = "SM North EDSA, Quezon City",
        fare = 120.0,
        originalFare = 120.0,
        dateLabel = "Today",
        timeLabel = "Now"
    )

    Box(modifier = Modifier.fillMaxSize()) {
        // Real-Time Leaflet Map View
        LeafletMapView(
            progress = gpsProgress,
            pickupTitle = ride.pickupAddress,
            dropoffTitle = ride.dropoffAddress,
            driverName = ride.driverName,
            vehiclePlate = ride.vehiclePlate,
            modifier = Modifier.fillMaxSize()
        )

        // Floating Top Bar / Live Status Pill
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
                .padding(16.dp)
        ) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = SwiftDark),
                elevation = CardDefaults.cardElevation(6.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 8.dp, vertical = 10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(
                        onClick = onBackToHome,
                        modifier = Modifier.size(36.dp)
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back to Home",
                            tint = SwiftWhite
                        )
                    }
                    Spacer(modifier = Modifier.width(4.dp))
                    Box(
                        modifier = Modifier
                            .size(10.dp)
                            .clip(CircleShape)
                            .background(
                                if (rideStatus == RideStatus.DRIVER_ARRIVED) SwiftGreen else SwiftGold
                            )
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = when (rideStatus) {
                                RideStatus.ACCEPTED -> "Driver is on the way"
                                RideStatus.DRIVER_ARRIVED -> "Driver has arrived at pickup!"
                                RideStatus.IN_PROGRESS -> "Trip in progress to destination"
                                RideStatus.COMPLETED -> "Trip completed! Welcome!"
                                else -> "Connecting to driver..."
                            },
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = SwiftWhite
                        )
                        Text(
                            text = if (etaMinutes > 0) "ETA: $etaMinutes mins • Leaflet Map API" else "At destination",
                            fontSize = 11.sp,
                            color = SwiftGold
                        )
                    }
                }
            }
        }

        // Bottom Driver & Trip Details Sheet
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .align(Alignment.BottomCenter)
                .navigationBarsPadding()
                .padding(16.dp),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = SwiftWhite),
            elevation = CardDefaults.cardElevation(10.dp)
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                // Driver Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(50.dp)
                            .clip(CircleShape)
                            .background(SwiftGoldLight),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "JD",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Black,
                            color = SwiftGoldDark
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = ride.driverName,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = SwiftTextPrimary
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Filled.Star, contentDescription = null, tint = SwiftGold, modifier = Modifier.size(14.dp))
                            Text(text = " 4.9 • 1,248 trips", fontSize = 12.sp, color = SwiftTextSecondary)
                        }
                    }
                    Column(horizontalAlignment = Alignment.End) {
                        Text(
                            text = ride.vehiclePlate,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = SwiftTextPrimary
                        )
                        Text(
                            text = ride.vehicleModel,
                            fontSize = 11.sp,
                            color = SwiftTextSecondary
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))
                HorizontalDivider(color = SwiftBorder)
                Spacer(modifier = Modifier.height(12.dp))

                // Route summary
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(SwiftGreen))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(text = ride.pickupAddress, fontSize = 12.sp, color = SwiftTextSecondary, maxLines = 1)
                }
                Spacer(modifier = Modifier.height(6.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(SwiftGoldDark))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(text = ride.dropoffAddress, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = SwiftTextPrimary, maxLines = 1)
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Action buttons: Chat, Call, SOS, Cancel
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Button(
                        onClick = onNavigateToChat,
                        modifier = Modifier
                            .weight(1f)
                            .height(46.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = SwiftGold,
                            contentColor = SwiftDark
                        )
                    ) {
                        Icon(imageVector = Icons.AutoMirrored.Filled.Send, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = "Chat", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }

                    OutlinedButton(
                        onClick = { viewModel.cancelRide() },
                        modifier = Modifier
                            .weight(1f)
                            .height(46.dp),
                        shape = RoundedCornerShape(12.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, SwiftBorder)
                    ) {
                        Text(text = "Cancel", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = SwiftTextSecondary)
                    }

                    OutlinedButton(
                        onClick = { viewModel.triggerSos() },
                        modifier = Modifier
                            .weight(0.7f)
                            .height(46.dp),
                        shape = RoundedCornerShape(12.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, SwiftRed)
                    ) {
                        Icon(Icons.Default.NotificationImportant, contentDescription = null, tint = SwiftRed, modifier = Modifier.size(20.dp))
                    }
                }
            }
        }
    }
}

// ==========================================
// 4. PASSENGER HISTORY SCREEN (Slide 4)
// ==========================================
@Composable
fun PassengerHistoryScreen(
    viewModel: SwiftRideViewModel
) {
    val allRides by viewModel.allRides.collectAsState()
    var selectedFilter by remember { mutableStateOf("All") }
    var searchQuery by remember { mutableStateOf("") }

    val filteredRides = allRides.filter { ride ->
        val matchesFilter = when (selectedFilter) {
            "Completed" -> ride.status == "COMPLETED"
            "Cancelled" -> ride.status == "CANCELLED"
            "Upcoming" -> ride.status == "ACTIVE" || ride.status == "PENDING"
            else -> true
        }
        val matchesSearch = searchQuery.isEmpty() ||
            ride.pickupAddress.contains(searchQuery, ignoreCase = true) ||
            ride.dropoffAddress.contains(searchQuery, ignoreCase = true) ||
            ride.driverName.contains(searchQuery, ignoreCase = true)
        matchesFilter && matchesSearch
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 20.dp, vertical = 12.dp)
    ) {
        // Top Header (Slide 4)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Ride History",
                fontFamily = com.example.ui.theme.PoppinsFontFamily,
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = SwiftDark
            )
            IconButton(onClick = { /* Filter */ }) {
                Icon(Icons.Default.FilterList, contentDescription = "Filter", tint = SwiftDark)
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Filter Tabs: [All] [Completed] [Cancelled] [Upcoming] (Slide 4)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            listOf("All", "Completed", "Cancelled", "Upcoming").forEach { filter ->
                val isSelected = selectedFilter == filter
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(20.dp))
                        .background(if (isSelected) SwiftDark else SwiftWhite)
                        .border(1.dp, if (isSelected) SwiftDark else SwiftBorder, RoundedCornerShape(20.dp))
                        .clickable { selectedFilter = filter }
                        .padding(vertical = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = filter,
                        fontSize = 12.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                        color = if (isSelected) SwiftWhite else SwiftTextSecondary
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Search bar (Slide 4)
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Search by location or driver", fontSize = 13.sp) },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = SwiftTextMuted) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(14.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = SwiftGold,
                unfocusedBorderColor = SwiftBorder,
                focusedContainerColor = SwiftWhite,
                unfocusedContainerColor = SwiftWhite
            )
        )

        Spacer(modifier = Modifier.height(14.dp))

        // List of Rides
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(filteredRides, key = { it.id }) { ride ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { viewModel.showReceipt(ride) },
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = SwiftWhite),
                    elevation = CardDefaults.cardElevation(1.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "${ride.dateLabel} • ${ride.timeLabel}",
                                fontSize = 11.sp,
                                color = SwiftTextMuted,
                                fontWeight = FontWeight.Medium
                            )

                            // Status Pill
                            val isCompleted = ride.status == "COMPLETED"
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(if (isCompleted) SwiftGreenBg else SwiftRedBg)
                                    .padding(horizontal = 8.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = if (isCompleted) "Completed" else "Cancelled",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isCompleted) SwiftGreenText else SwiftRedText
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        // Route timeline (Slide 4)
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(SwiftGreen))
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = ride.pickupAddress,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Medium,
                                color = SwiftTextPrimary
                            )
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(SwiftGoldDark))
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = ride.dropoffAddress,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = SwiftTextPrimary
                            )
                        }

                        Spacer(modifier = Modifier.height(12.dp))
                        HorizontalDivider(color = SwiftBorder)
                        Spacer(modifier = Modifier.height(10.dp))

                        // Driver info and Fare + Receipt button (Slide 4)
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = ride.driverName,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = SwiftTextPrimary
                                )
                                Text(
                                    text = "${ride.vehicleModel} • ${ride.vehiclePlate}",
                                    fontSize = 11.sp,
                                    color = SwiftTextSecondary
                                )
                            }

                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = "₱${"%.2f".format(ride.fare)}",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Black,
                                    color = SwiftTextPrimary
                                )
                                Spacer(modifier = Modifier.width(10.dp))
                                Button(
                                    onClick = { viewModel.showReceipt(ride) },
                                    shape = RoundedCornerShape(8.dp),
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = SwiftGoldLight,
                                        contentColor = SwiftGoldDark
                                    ),
                                    modifier = Modifier.height(32.dp)
                                ) {
                                    Text(text = "Receipt", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }

            // Referral banner at bottom of History (Slide 4)
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 12.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFFFF9E6)),
                    border = androidx.compose.foundation.BorderStroke(1.dp, SwiftGoldBorder)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = "🎁", fontSize = 24.sp)
                        Spacer(modifier = Modifier.width(10.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Invite friends, get ₱50",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = SwiftTextPrimary
                            )
                            Text(
                                text = "Share your code and earn rewards!",
                                fontSize = 11.sp,
                                color = SwiftTextSecondary
                            )
                        }
                        Button(
                            onClick = {
                                viewModel.triggerPushNotification(
                                    title = "Invite Code Copied! 📋",
                                    message = "Code SWIFT-JOHN50 copied to clipboard. Share with friends!",
                                    type = "PROMO"
                                )
                            },
                            shape = RoundedCornerShape(8.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = SwiftGold,
                                contentColor = SwiftDark
                            ),
                            modifier = Modifier.height(34.dp)
                        ) {
                            Text(text = "Invite Now", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}

// ==========================================
// 5. PASSENGER CHAT SCREEN (Slide 5)
// ==========================================
@Composable
fun PassengerChatScreen(
    viewModel: SwiftRideViewModel
) {
    val messages by viewModel.chatMessages.collectAsState()
    var textMessage by remember { mutableStateOf("") }

    Column(modifier = Modifier.fillMaxSize().background(SwiftGrayBg)) {
        // Driver header (Slide 5)
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = SwiftWhite,
            shadowElevation = 2.dp
        ) {
            Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(46.dp)
                            .clip(CircleShape)
                            .background(SwiftGoldLight),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "JD", fontSize = 16.sp, fontWeight = FontWeight.Black, color = SwiftGoldDark)
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(text = "Juan Dela Cruz", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = SwiftTextPrimary)
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Star, contentDescription = null, tint = SwiftGold, modifier = Modifier.size(12.dp))
                            Text(text = " 4.9 • 1,248 trips • ", fontSize = 11.sp, color = SwiftTextSecondary)
                            Text(text = "Online 🟢", fontSize = 11.sp, color = SwiftGreenText, fontWeight = FontWeight.Bold)
                        }
                    }
                    IconButton(onClick = {
                        viewModel.triggerPushNotification(
                            title = "Calling Driver 📞",
                            message = "Connecting to Juan Dela Cruz...",
                            type = "RIDE_UPDATE"
                        )
                    }) {
                        Icon(Icons.Default.Call, contentDescription = "Call", tint = SwiftGreenText)
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Trip route banner (Slide 5)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(Color(0xFFF3F4F6))
                        .padding(horizontal = 10.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(modifier = Modifier.weight(1f), verticalAlignment = Alignment.CenterVertically) {
                        Text(text = "Bagong Silang", fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                        Text(text = " ➔ ", fontSize = 11.sp, color = SwiftGoldDark)
                        Text(text = "SM North EDSA", fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                    }
                    Text(text = "₱180.00", fontSize = 12.sp, fontWeight = FontWeight.Black, color = SwiftTextPrimary)
                }
            }
        }

        // Messages list
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 16.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(messages, key = { it.id }) { msg ->
                val isMe = msg.senderRole == "PASSENGER"
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = if (isMe) Arrangement.End else Arrangement.Start
                ) {
                    Column(horizontalAlignment = if (isMe) Alignment.End else Alignment.Start) {
                        Box(
                            modifier = Modifier
                                .clip(
                                    RoundedCornerShape(
                                        topStart = 16.dp,
                                        topEnd = 16.dp,
                                        bottomStart = if (isMe) 16.dp else 4.dp,
                                        bottomEnd = if (isMe) 4.dp else 16.dp
                                    )
                                )
                                .background(if (isMe) SwiftGold else SwiftWhite)
                                .padding(horizontal = 14.dp, vertical = 10.dp)
                        ) {
                            Text(
                                text = msg.message,
                                fontSize = 13.sp,
                                color = if (isMe) SwiftDark else SwiftTextPrimary
                            )
                        }
                        Text(
                            text = msg.timeString,
                            fontSize = 10.sp,
                            color = SwiftTextMuted,
                            modifier = Modifier.padding(top = 2.dp, start = 4.dp, end = 4.dp)
                        )
                    }
                }
            }
        }

        // Quick action chips: [Send Location] [Quick Reply] [Call Driver] (Slide 5)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 6.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            QuickChatChip(label = "📍 Send Location") {
                viewModel.sendChatMessage(1, "📍 I shared my live location: Bagong Silang Gate 2", isLocation = true)
            }
            QuickChatChip(label = "⚡ Quick Reply") {
                viewModel.sendChatMessage(1, "Hi Kuya, I am waiting right outside the gate!")
            }
            QuickChatChip(label = "📞 Call Driver") {
                viewModel.triggerPushNotification(
                    title = "Calling Driver 📞",
                    message = "Calling Juan Dela Cruz (+63 917 123 4567)...",
                    type = "RIDE_UPDATE"
                )
            }
        }

        // Message input bar (Slide 5)
        Surface(
            modifier = Modifier.fillMaxWidth().navigationBarsPadding(),
            color = SwiftWhite,
            shadowElevation = 8.dp
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = textMessage,
                    onValueChange = { textMessage = it },
                    placeholder = { Text("Type a message...", fontSize = 13.sp) },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(24.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = SwiftGold,
                        unfocusedBorderColor = SwiftBorder
                    )
                )
                Spacer(modifier = Modifier.width(8.dp))
                IconButton(
                    onClick = {
                        if (textMessage.isNotBlank()) {
                            viewModel.sendChatMessage(1, textMessage)
                            textMessage = ""
                        }
                    },
                    modifier = Modifier
                        .size(44.dp)
                        .clip(CircleShape)
                        .background(SwiftGold)
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.Send,
                        contentDescription = "Send",
                        tint = SwiftDark,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        }
    }
}

@Composable
private fun QuickChatChip(label: String, onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(16.dp))
            .background(SwiftWhite)
            .border(1.dp, SwiftBorder, RoundedCornerShape(16.dp))
            .clickable { onClick() }
            .padding(horizontal = 10.dp, vertical = 6.dp)
    ) {
        Text(text = label, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = SwiftTextPrimary)
    }
}

// ==========================================
// 6. PASSENGER PROFILE SCREEN (Slide 5)
// ==========================================
@Composable
fun PassengerProfileScreen(
    viewModel: SwiftRideViewModel
) {
    val walletBalance by viewModel.passengerWalletBalance.collectAsState()
    val userName by viewModel.userName.collectAsState()
    val userPhone by viewModel.userPhone.collectAsState()
    val profilePictureUri by viewModel.profilePictureUri.collectAsState()
    var showTopUpDialog by remember { mutableStateOf(false) }

    if (showTopUpDialog) {
        TopUpWalletDialog(
            currentBalance = walletBalance,
            onDismiss = { showTopUpDialog = false },
            onTopUpSuccess = { amount, method ->
                viewModel.topUpWallet(amount, method)
            }
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 20.dp, vertical = 12.dp)
            .padding(bottom = 24.dp)
    ) {
        Text(
            text = "User's Profile",
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            color = SwiftTextPrimary
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Profile card: John Michael Nabung (Slide 5)
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .clip(CircleShape)
                    .background(SwiftDark),
                contentAlignment = Alignment.Center
            ) {
                if (profilePictureUri != null) {
                    coil.compose.AsyncImage(
                        model = profilePictureUri,
                        contentDescription = "Profile Picture",
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )
                } else {
                    Text(
                        text = userName.split(" ").mapNotNull { it.firstOrNull() }.joinToString("").take(2).uppercase(),
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = SwiftGold
                    )
                }
            }
            Spacer(modifier = Modifier.width(14.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = userName,
                    fontFamily = com.example.ui.theme.PoppinsFontFamily,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = SwiftDark
                )
                Text(
                    text = userPhone,
                    fontSize = 12.sp,
                    color = SwiftTextSecondary
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Security, contentDescription = null, tint = SwiftGreenText, modifier = Modifier.size(14.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = "Verified Account", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = SwiftGreenText)
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Wallet Balance Card (Slide 5)
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(containerColor = SwiftDark)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(18.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(text = "Wallet Balance", fontSize = 12.sp, color = Color(0xFFD0D5DD))
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "₱${"%.2f".format(walletBalance)}",
                        fontSize = 26.sp,
                        fontWeight = FontWeight.Black,
                        color = SwiftWhite
                    )
                }
                Column(horizontalAlignment = Alignment.End) {
                    Button(
                        onClick = { showTopUpDialog = true },
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = SwiftGold,
                            contentColor = SwiftDark
                        ),
                        modifier = Modifier.height(36.dp)
                    ) {
                        Text(text = "Top Up Wallet >", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.QrCode, contentDescription = null, tint = SwiftGold, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(text = "My QR Code", fontSize = 11.sp, color = SwiftGold)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Stat row: 25 Completed Rides, 4.8 Your Rating, 6 Saved Places, 3 Promo Vouchers (Slide 5)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            listOf(
                "25" to "Completed Rides",
                "4.8" to "Your Rating",
                "6" to "Saved Places",
                "3" to "Promo Vouchers"
            ).forEach { (value, label) ->
                Card(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = SwiftWhite),
                    elevation = CardDefaults.cardElevation(1.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(10.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(text = value, fontSize = 16.sp, fontWeight = FontWeight.Black, color = SwiftGoldDark)
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(text = label, fontSize = 10.sp, color = SwiftTextSecondary, maxLines = 1)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // Profile Menu Items (Slide 5)
        listOf(
            "Personal Information" to "Manage your personal details",
            "Payment Methods" to "Manage cards and payment options",
            "Saved Places" to "Manage your saved locations",
            "Ride History" to "View your past rides",
            "Your Reviews" to "View and manage your reviews",
            "Refer & Earn" to "Invite friends and earn rewards",
            "Help Center" to "Get help and support",
            "Safety Center" to "Safety tools and emergency contacts",
            "Settings" to "App preferences and notifications"
        ).forEach { (title, subtitle) ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 3.dp)
                    .clickable { 
                        when (title) {
                            "Ride History" -> viewModel.setPassengerTab("History")
                            else -> viewModel.showProfileDialog(title)
                        }
                    },
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = SwiftWhite),
                elevation = CardDefaults.cardElevation(0.5.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(text = title, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = SwiftTextPrimary)
                        Text(text = subtitle, fontSize = 11.sp, color = SwiftTextSecondary)
                    }
                    Text(text = ">", fontSize = 14.sp, color = SwiftTextMuted)
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Log Out Button (Slide 5)
        OutlinedButton(
            onClick = { viewModel.logout() },
            modifier = Modifier.fillMaxWidth().height(46.dp),
            shape = RoundedCornerShape(12.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, SwiftRed)
        ) {
            Text(text = "Log Out", color = SwiftRed, fontWeight = FontWeight.Bold)
        }
    }
}
