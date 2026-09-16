import { useMutation } from "@tanstack/react-query";
import contactService from "../services/contactService";
export const useContactMutation = () =>
  useMutation({ mutationFn: contactService.send });
