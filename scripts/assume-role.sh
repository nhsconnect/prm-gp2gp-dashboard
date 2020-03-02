#! /bin/bash

unset_vars() {
    echo unset AWS_ACCESS_KEY_ID
    echo unset AWS_SECRET_ACCESS_KEY
    echo unset AWS_SESSION_TOKEN
}

assume() {
    $(unset_vars)
    export SESSION_NAME=$(date +%s)
    temp_role=$(aws sts assume-role \
                        --role-arn "$ROLE_ARN" \
                        --role-session-name "$SESSION_NAME")

    if [ $? -eq 0 ]; then
        export TEMPWORD="AWS"
        echo export $TEMPWORD"_ACCESS_KEY_ID"=$(echo $temp_role | jq .Credentials.AccessKeyId | xargs)
        echo export $TEMPWORD"_SECRET_ACCESS_KEY"=$(echo $temp_role | jq .Credentials.SecretAccessKey | xargs)
        echo export $TEMPWORD"_SESSION_TOKEN"=$(echo $temp_role | jq .Credentials.SessionToken | xargs)
    fi
}

assume_mfa() {
    user_arn=$(aws sts get-caller-identity --query Arn --output text)
    aws_username=$(echo ${user_arn##*/})  # Get username from end of ARN
    mfa_arn=$(aws iam list-mfa-devices \
                --user-name $aws_username \
                --query 'MFADevices[0].SerialNumber' \
                --output text)

    >&2 echo Role is $ROLE_ARN
    >&2 echo Username is $aws_username
    >&2 echo MFA ARN is $mfa_arn
    >&2 echo OTP IS: $OTP

    export SESSION_NAME=$(date +%s)

    temp_role=$(aws sts assume-role \
                        --role-arn "$ROLE_ARN" \
                        --serial-number "$mfa_arn" \
                        --token-code ${OTP} \
                        --role-session-name "$SESSION_NAME")

    if [ $? -eq 0 ]; then
        export TEMPWORD="AWS"
        echo export $TEMPWORD"_ACCESS_KEY_ID"=$(echo $temp_role | jq .Credentials.AccessKeyId | xargs)
        echo export $TEMPWORD"_SECRET_ACCESS_KEY"=$(echo $temp_role | jq .Credentials.SecretAccessKey | xargs)
        echo export $TEMPWORD"_SESSION_TOKEN"=$(echo $temp_role | jq .Credentials.SessionToken | xargs)
    fi
}

usage () {
  echo "Parameters:"
  echo "  -r [aws role arn]   to assume specified role"
  echo "  -u|--unset          to unset AWS_* variables"
  echo "  -h|--help           for this help message"
}

if [ $# -eq 0 ]; then
  usage
  exit 1
fi

while [ $# -gt 0 ]; do
    case $1 in
        -r | --role)
           shift
           ROLE_ARN=$1
           assume
           ;;
        -rmfa | --role_mfa)
           shift
           ROLE_ARN=$1
           OTP=$2
           assume_mfa
           exit 0
           ;;
        -h | --help)
           usage
           exit 0
           ;;
        -u | --unset)
           unset_vars
           exit 0
           ;;
        *)
           usage
           exit 1
           ;;
    esac
    shift
done