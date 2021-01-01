import React, { useState } from "react";
import styled from "styled-components";
import { Try } from "../../../../common/try";
import { Card } from "../../../common/components/Card/Card";
import { Form } from "../../../common/components/Form/Form";
import { FormError } from "../../../common/components/Form/FormError";
import { FormInput } from "../../../common/components/Form/FormInput";
import { FormSubmitButton } from "../../../common/components/Form/FormSubmitButton";
import { InlineErrorMessage } from "../../../common/components/Form/InlineErrorMessage";
import { FullPageContainer } from "../../common/FullPageContainer";

interface IResetPasswordProps {
  onReset: (password: string) => Promise<Try>;
}

const Container = styled.div`
  width: 320px;
`;

export const ResetPassword: React.FC<IResetPasswordProps> = (props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string>();

  const onSubmit = async () => {
    setDirty(true);

    if (!(password && confirmPassword && password === confirmPassword)) {
      return;
    }

    setIsProcessing(true);

    const result = await props.onReset(password);
    setError(result.success ? undefined : result.error);

    setIsProcessing(false);
  };

  const passwordError = () => {
    if (dirty && !password) {
      return "Password is required";
    }
  };

  const confirmPasswordError = () => {
    if (!dirty) {
      return;
    }

    if (!confirmPassword) {
      return "Please confirm password";
    }

    if (password !== confirmPassword) {
      return "Passwords must match";
    }
  };

  return (
    <FullPageContainer>
      <Card>
        <Container>
          <Form onSubmit={onSubmit}>
            <FormInput
              label="Password"
              placeholder="Password"
              inputType="password"
              value={password}
              onChange={(val) => setPassword(val)}
              hasError={!!passwordError()}
              secondaryLabel={
                <InlineErrorMessage>{passwordError()}</InlineErrorMessage>
              }
            />
            <FormInput
              label="Confirm Password"
              placeholder="Confirm Password"
              inputType="password"
              value={confirmPassword}
              onChange={(val) => setConfirmPassword(val)}
              hasError={!!confirmPasswordError()}
              secondaryLabel={
                <InlineErrorMessage>
                  {confirmPasswordError()}
                </InlineErrorMessage>
              }
            />
            <FormSubmitButton processing={isProcessing}>
              Set New Password
            </FormSubmitButton>
            {error && <FormError>{error}</FormError>}
          </Form>
        </Container>
      </Card>
    </FullPageContainer>
  );
};
