<?php
// Database connection parameters
$host = 'localhost'; // Change this if your database is hosted elsewhere
$dbname = 'gps';
$username = 'your_database_username'; // Change this to your database username
$password = 'your_database_password'; // Change this to your database password

// Attempt to connect to the database
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Handle database connection error
    die("Database connection failed: " . $e->getMessage());
}

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Check if username and password are set in the request data
    if (isset($_POST["username"]) && isset($_POST["password"])) {
        $username = $_POST["username"];
        $password = $_POST["password"];

        // Query to check if the provided credentials exist in the database
        $stmt = $pdo->prepare("SELECT * FROM login WHERE Username = ? AND Password = ?");
        $stmt->execute([$username, $password]);
        $user = $stmt->fetch();

        if ($user) {
            // Authentication successful, redirect to index.html
            header("Location: index.html");
            exit; // Stop further execution
        } else {
            // Authentication failed
            echo "Invalid username or password"; // You can return a custom error message if needed
            exit; // Stop further execution
        }
    }
}

// If request method is not POST or if username/password are not set
// Return an error response
echo "error";
?>
