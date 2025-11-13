#!/bin/bash

# Storage Usage Monitor for Intelligent Storage App
# Run this anytime to check how much space your app is using

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 INTELLIGENT STORAGE - SPACE MONITOR"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Mac overall storage
echo "🖥️  YOUR MAC STORAGE:"
df -h / | tail -1 | awk '{print "   Total: " $2 "\n   Used:  " $3 " (" $5 ")\n   Free:  " $4}'
echo ""

# App storage breakdown
echo "📦 APP STORAGE BREAKDOWN:"
cd "/Users/aks/Desktop/OSC hackathon2"

# User uploaded files
USER_FILES=$(du -sh backend/storage/users 2>/dev/null | awk '{print $1}')
echo "   👥 User Files:        $USER_FILES"

# Backend storage system
BACKEND_STORAGE=$(du -sh backend/storage 2>/dev/null | awk '{print $1}')
echo "   🗄️  Backend Storage:    $BACKEND_STORAGE"

# Dependencies
BACKEND_DEPS=$(du -sh backend/node_modules 2>/dev/null | awk '{print $1}')
FRONTEND_DEPS=$(du -sh frontend/node_modules 2>/dev/null | awk '{print $1}')
echo "   📚 Backend Packages:   $BACKEND_DEPS"
echo "   📚 Frontend Packages:  $FRONTEND_DEPS"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "👥 USER BREAKDOWN:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd backend/storage/users 2>/dev/null

# Count users
USER_COUNT=$(ls -1 | wc -l | xargs)
echo "   Total Users: $USER_COUNT"
echo ""

# Show each user's storage
echo "   Individual Usage:"
for user_dir in */; do
    if [ -d "$user_dir" ]; then
        SIZE=$(du -sh "$user_dir" 2>/dev/null | awk '{print $1}')
        USER_ID=$(basename "$user_dir")

        # Try to get email from users.json
        EMAIL=$(grep -A 2 "\"id\": \"$USER_ID\"" ../users.json 2>/dev/null | grep "email" | cut -d'"' -f4)

        if [ ! -z "$EMAIL" ]; then
            echo "   📁 $EMAIL: $SIZE"
        else
            echo "   📁 $USER_ID: $SIZE"
        fi
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Storage Check Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
